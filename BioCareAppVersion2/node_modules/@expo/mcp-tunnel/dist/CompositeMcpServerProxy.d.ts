import { McpServerProxy } from './types.js';
/**
 * A MCP server proxy that serves MCP capabilities for both `StdioMcpServerProxy` and `TunnelMcpServerProxy`.
 */
export declare class CompositeMcpServerProxy implements McpServerProxy {
    private readonly stdioProxy;
    private readonly tunnelProxy;
    constructor({ tunnelServerUrl, projectRoot, devServerUrl, stdioMcpServerName, stdioMcpServerVersion, }: {
        tunnelServerUrl: string;
        projectRoot: string;
        devServerUrl: string;
        stdioMcpServerName?: string;
        stdioMcpServerVersion?: string;
    });
    registerTool: McpServerProxy['registerTool'];
    registerPrompt: McpServerProxy['registerPrompt'];
    registerResource: McpServerProxy['registerResource'];
    start(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=CompositeMcpServerProxy.d.ts.map