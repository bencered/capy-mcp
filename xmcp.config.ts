import { type XmcpConfig } from "xmcp";

const config: XmcpConfig = {
  paths: {
    tools: "src/tools",
    prompts: false,
    resources: false
  },
  template: {
    name: "Capy MCP Server",
    description:
      "xmcp server exposing the supported Capy API for projects, models, threads, and browser snapshots. Use threads for interactive work; task endpoints are intentionally not exposed."
  },
  http: {
    host: "127.0.0.1",
    port: 3001,
    endpoint: "/mcp",
    debug: false
  },
  stdio: {
    silent: true,
    debug: false
  }
};

export default config;
