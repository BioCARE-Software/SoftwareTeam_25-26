/**
 * JSON-RPC version
 */
export declare const JSON_RPC_VERSION = "2.0";
/**
 * WebSocket method: handshake to send initial client information (client -> server)
 */
export declare const WS_METHOD_HANDSHAKE = "handshake";
/**
 * WebSocket method: to register MCP tool (client -> server)
 */
export declare const WS_METHOD_REGISTER_MCP_TOOL = "register_mcp_tool";
/**
 * WebSocket method: to register MCP prompt (client -> server)
 */
export declare const WS_METHOD_REGISTER_MCP_PROMPT = "register_mcp_prompt";
/**
 * WebSocket method: to register MCP resource (client -> server)
 */
export declare const WS_METHOD_REGISTER_MCP_RESOURCE = "register_mcp_resource";
/**
 * WebSocket method: call MCP tool (server -> client)
 */
export declare const WS_METHOD_MCP_TOOLS_CALL = "tools/call";
/**
 * WebSocket method: get MCP prompt (server -> client)
 */
export declare const WS_METHOD_MCP_PROMPTS_GET = "prompts/get";
/**
 * WebSocket method: read MCP resource (server -> client)
 */
export declare const WS_METHOD_MCP_RESOURCES_READ = "resources/read";
/**
 * Custom WebSocket close codes for MCP tunnel.
 * These codes are in the 4000-4999 range reserved for application use.
 * Standard close codes: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
 */
export declare enum WSTunnelCloseCode {
    /**
     * Standard close code: Policy Violation (e.g., authentication failure).
     * This is a standard WebSocket close code (1008).
     */
    POLICY_VIOLATION = 1008,
    /**
     * Unknown error.
     */
    UNKNOWN_ERROR = 4000,
    /**
     * Server is shutting down gracefully.
     */
    SERVER_SHUTDOWN = 4001,
    /**
     * Client is banned or blocked from connecting.
     */
    CLIENT_BANNED = 4002,
    /**
     * Multiple tunnel clients are not supported yet.
     */
    MULTIPLE_CLIENTS_CONNECTED = 4003,
    /**
     * Client is possibly stale and needs to reconnect manually.
     */
    STALE_CLIENT = 4004
}
/**
 * Error messages corresponding to each WebSocket close code.
 */
export declare const WSTunnelCloseMessage: Record<WSTunnelCloseCode, string>;
/**
 * Set of WebSocket close codes that should NOT trigger automatic reconnection.
 * These represent permanent failures that require manual intervention.
 */
export declare const NON_RECONNECTABLE_CLOSE_CODES: Set<number>;
//# sourceMappingURL=constants.d.ts.map