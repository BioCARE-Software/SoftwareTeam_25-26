import WebSocket from 'ws';
import { JSON_RPC_VERSION, NON_RECONNECTABLE_CLOSE_CODES, WS_METHOD_HANDSHAKE, } from './constants.js';
// Maximum message size supported by the server
const MAX_MESSAGE_SIZE = 1024 * 1024 * 1; // 1MB
const DEFAULT_RECONNECT_INTERVAL = 5000;
/**
 * A MCP transport that connects to a WebSocket tunnel server and serves as a reverse proxy for the MCP server.
 */
export class ReverseTunnelClientTransport {
    logger;
    wsHeaders;
    ws;
    remoteUrl;
    reconnectInterval;
    reconnectTimer;
    isConnected = false;
    isServerAborted = false;
    handshakeData;
    onConnectionChange;
    onServerAbort;
    constructor(remoteUrl, options) {
        const { reconnectInterval = DEFAULT_RECONNECT_INTERVAL } = options;
        this.logger = options.logger ?? console;
        this.wsHeaders = options.wsHeaders ?? {};
        // Ensure the URL points to the WebSocket tunnel endpoint
        this.remoteUrl = remoteUrl.endsWith('/tunnel') ? remoteUrl : `${remoteUrl}/tunnel`;
        this.reconnectInterval = reconnectInterval;
        this.handshakeData = {
            projectRoot: options.projectRoot,
            devServerUrl: options.devServerUrl,
        };
    }
    async start() {
        await this.connect();
    }
    async connect() {
        try {
            this.logger.debug(`[MCP] Connecting to remote MCP tunnel server at ${this.remoteUrl}...`);
            this.ws = new WebSocket(this.remoteUrl, { headers: this.wsHeaders });
            this.ws.on('open', () => {
                this.logger.debug('[MCP] Connected to remote MCP tunnel server');
                this.isConnected = true;
                // Clear any existing reconnect timer
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                    this.reconnectTimer = undefined;
                }
                this.sendHandshake();
                // Notify connection state change
                this.onConnectionChange?.(true);
            });
            this.ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.onMessage?.(message);
                }
                catch (error) {
                    this.logger.error('[MCP] Failed to parse message from remote server:', error);
                }
            });
            this.ws.on('close', (code, reason) => {
                this.logger.debug(`[MCP] Disconnected from remote MCP tunnel server (code: ${code}, reason: ${reason.toString()})`);
                this.isConnected = false;
                this.onConnectionChange?.(false);
                // Check if this is a non-reconnectable error
                if (NON_RECONNECTABLE_CLOSE_CODES.has(code)) {
                    this.isServerAborted = true;
                    const reasonStr = reason.toString() || 'Connection closed from server abort';
                    this.logger.error(`[MCP] Server aborted connection (code: ${code}): ${reasonStr}. Will not reconnect.`);
                    this.onServerAbort?.(reasonStr, code);
                    return;
                }
                this.scheduleReconnect();
            });
            this.ws.on('error', (error) => {
                this.logger.error('[MCP] WebSocket error:', error);
                this.isConnected = false;
                this.onConnectionChange?.(false);
                // Note: 'close' event will be emitted after 'error', which will handle reconnection
            });
            // Wait for connection to be established
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 10000);
                this.ws.on('open', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                this.ws.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
            });
        }
        catch (error) {
            this.logger.error('[MCP] Failed to connect to remote MCP tunnel server:', error);
            this.scheduleReconnect();
            throw error;
        }
    }
    scheduleReconnect() {
        if (this.isServerAborted) {
            this.logger.debug('[MCP] Not scheduling reconnect due to permanent disconnection');
            return;
        }
        if (this.reconnectTimer) {
            return; // Already scheduled
        }
        this.logger.debug(`[MCP] Reconnecting in ${this.reconnectInterval / 1000} seconds...`);
        this.reconnectTimer = setTimeout(async () => {
            this.reconnectTimer = undefined;
            try {
                await this.connect();
            }
            catch {
                // Connection will be retried automatically
                this.logger.error('[MCP] Reconnection failed, will retry again');
            }
        }, this.reconnectInterval);
    }
    async send(message, options) {
        if (!this.ws || !this.isConnected) {
            throw new Error('Not connected to remote MCP tunnel server');
        }
        const messageStr = JSON.stringify(message);
        if (messageStr.length > MAX_MESSAGE_SIZE) {
            const messageId = 'id' in message ? message.id : undefined;
            this.ws.send(JSON.stringify({
                jsonrpc: JSON_RPC_VERSION,
                id: messageId,
                error: {
                    code: -32603,
                    message: `Message size exceeds the maximum supported size: size[${messageStr.length}] max[${MAX_MESSAGE_SIZE}]`,
                },
            }));
            return;
        }
        this.ws.send(messageStr);
    }
    async close() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = undefined;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }
        this.isConnected = false;
        this.onConnectionChange?.(false);
    }
    async sendHandshake() {
        if (!this.ws || !this.isConnected) {
            this.logger.warn('[MCP] Cannot send handshake: not connected');
            return;
        }
        try {
            await this.send({
                jsonrpc: JSON_RPC_VERSION,
                method: WS_METHOD_HANDSHAKE,
                params: this.handshakeData,
            });
            this.logger.debug('[MCP] Handshake sent', this.handshakeData);
        }
        catch (error) {
            this.logger.error('[MCP] Failed to send handshake:', error);
        }
    }
    onMessage;
}
