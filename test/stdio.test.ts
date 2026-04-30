import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

describe("stdio transport", () => {
  it("supports MCP tool listing with silent stdio output", async () => {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: ["dist/stdio.js"],
      env: {
        ...process.env,
        CAPY_API_TOKEN: "capy_test"
      }
    });
    const client = new Client({
      name: "vitest",
      version: "1.0.0"
    });

    try {
      await client.connect(transport);
      const response = await client.listTools();

      expect(response.tools.some((tool) => tool.name === "models_list")).toBe(true);
      expect(response.tools.some((tool) => tool.name === "threads_create_and_start")).toBe(true);
      expect(response.tools.some((tool) => tool.name === "tasks_get")).toBe(false);
      expect(response.tools.some((tool) => tool.name === "tasks_get_diff")).toBe(false);
      expect(response.tools.some((tool) => tool.name.startsWith("browser_snapshots_"))).toBe(false);
    } finally {
      await client.close();
      await transport.close();
    }
  }, 20000);
});
