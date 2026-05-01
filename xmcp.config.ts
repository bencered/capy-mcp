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
      "Unofficial MCP server for Capy, an agent execution platform for software projects. Projects are the top-level workspace. Threads are the primary interactive execution unit: create a thread to start work, send messages to continue existing work, inspect thread state, and page through thread messages incrementally. Call models_list before choosing model or buildModel values. threads_list_messages is paginated and should be read in small pages. Task and browser snapshot endpoints are intentionally not exposed."
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
