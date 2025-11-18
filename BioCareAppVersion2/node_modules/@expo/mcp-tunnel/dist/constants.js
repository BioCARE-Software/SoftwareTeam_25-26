/**
 * JSON-RPC version
 */
export const JSON_RPC_VERSION = '2.0';
/**
 * WebSocket method: handshake to send initial client information (client -> server)
 */
export const WS_METHOD_HANDSHAKE = 'handshake';
/**
 * WebSocket method: to register MCP tool (client -> server)
 */
export const WS_METHOD_REGISTER_MCP_TOOL = 'register_mcp_tool';
/**
 * WebSocket method: to register MCP prompt (client -> server)
 */
export const WS_METHOD_REGISTER_MCP_PROMPT = 'register_mcp_prompt';
/**
 * WebSocket method: to register MCP resource (client -> server)
 */
export const WS_METHOD_REGISTER_MCP_RESOURCE = 'register_mcp_resource';
/**
 * WebSocket method: call MCP tool (server -> client)
 */
export const WS_METHOD_MCP_TOOLS_CALL = 'tools/call';
/**
 * WebSocket method: get MCP prompt (server -> client)
 */
export const WS_METHOD_MCP_PROMPTS_GET = 'prompts/get';
/**
 * WebSocket method: read MCP resource (server -> client)
 */
export const WS_METHOD_MCP_RESOURCES_READ = 'resources/read';
/**
 * Custom WebSocket close codes for MCP tunnel.
 * These codes are in the 4000-4999 range reserved for application use.
 * Standard close codes: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
 */
export var WSTunnelCloseCode;
(function (WSTunnelCloseCode) {
    /**
     * Standard close code: Policy Violation (e.g., authentication failure).
     * This is a standard WebSocket close code (1008).
     */
    WSTunnelCloseCode[WSTunnelCloseCode["POLICY_VIOLATION"] = 1008] = "POLICY_VIOLATION";
    /**
     * Unknown error.
     */
    WSTunnelCloseCode[WSTunnelCloseCode["UNKNOWN_ERROR"] = 4000] = "UNKNOWN_ERROR";
    /**
     * Server is shutting down gracefully.
     */
    WSTunnelCloseCode[WSTunnelCloseCode["SERVER_SHUTDOWN"] = 4001] = "SERVER_SHUTDOWN";
    /**
     * Client is banned or blocked from connecting.
     */
    WSTunnelCloseCode[WSTunnelCloseCode["CLIENT_BANNED"] = 4002] = "CLIENT_BANNED";
    /**
     * Multiple tunnel clients are not supported yet.
     */
    WSTunnelCloseCode[WSTunnelCloseCode["MULTIPLE_CLIENTS_CONNECTED"] = 4003] = "MULTIPLE_CLIENTS_CONNECTED";
    /**
     * Client is possibly stale and needs to reconnect manually.
     */
    WSTunnelCloseCode[WSTunnelCloseCode["STALE_CLIENT"] = 4004] = "STALE_CLIENT";
})(WSTunnelCloseCode || (WSTunnelCloseCode = {}));
/**
 * Error messages corresponding to each WebSocket close code.
 */
export const WSTunnelCloseMessage = {
    [WSTunnelCloseCode.POLICY_VIOLATION]: 'Connection closed due to policy violation',
    [WSTunnelCloseCode.UNKNOWN_ERROR]: 'Unknown error',
    [WSTunnelCloseCode.SERVER_SHUTDOWN]: 'Server is shutting down',
    [WSTunnelCloseCode.CLIENT_BANNED]: 'Client is banned or blocked from connecting',
    [WSTunnelCloseCode.MULTIPLE_CLIENTS_CONNECTED]: 'Multiple tunnel clients are not supported yet',
    [WSTunnelCloseCode.STALE_CLIENT]: 'Client is possibly stale and needs to reconnect manually',
};
/**
 * Set of WebSocket close codes that should NOT trigger automatic reconnection.
 * These represent permanent failures that require manual intervention.
 */
export const NON_RECONNECTABLE_CLOSE_CODES = new Set([
    WSTunnelCloseCode.POLICY_VIOLATION,
    WSTunnelCloseCode.CLIENT_BANNED,
    WSTunnelCloseCode.MULTIPLE_CLIENTS_CONNECTED,
    WSTunnelCloseCode.STALE_CLIENT,
]);
