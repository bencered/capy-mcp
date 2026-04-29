import { spawn, type ChildProcess } from "node:child_process";

const serverUrl = "http://127.0.0.1:3001/mcp";

type HeaderMap = Record<string, string>;

async function rpc(body: Record<string, unknown>, headers: HeaderMap = {}) {
  return fetch(serverUrl, {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });
}

async function readRpcBody(response: Response) {
  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!text) {
    return null;
  }

  if (contentType.includes("text/event-stream")) {
    const dataLine = text
      .split(/\r?\n/)
      .find((line) => line.startsWith("data: "));

    if (!dataLine) {
      throw new Error(`Missing data payload in SSE response: ${text}`);
    }

    return JSON.parse(dataLine.slice(6));
  }

  return JSON.parse(text);
}

async function initialize(headers: HeaderMap = {}) {
  return rpc(
    {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: {
          name: "vitest",
          version: "1.0.0"
        }
      }
    },
    headers
  );
}

async function notifyInitialized(headers: HeaderMap = {}) {
  return rpc(
    {
      jsonrpc: "2.0",
      method: "notifications/initialized"
    },
    headers
  );
}

async function toolsList(headers: HeaderMap = {}) {
  return rpc(
    {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    },
    headers
  );
}

async function waitForServer(headers: HeaderMap) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await initialize(headers);
      if (response.status > 0) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("HTTP MCP server did not become ready");
}

describe("http auth middleware", () => {
  let child: ChildProcess;

  beforeAll(async () => {
    child = spawn("node", ["dist/http.js"], {
      env: {
        ...process.env,
        CAPY_API_TOKEN: "capy_test",
        XMCP_HTTP_API_KEY: "test-http-key"
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    await waitForServer({ "x-api-key": "test-http-key" });
  }, 20000);

  afterAll(() => {
    child.kill("SIGTERM");
  });

  it("rejects requests without the configured API key", async () => {
    const response = await initialize();
    expect(response.ok).toBe(false);
  });

  it("rejects requests with the wrong API key", async () => {
    const response = await initialize({ "x-api-key": "wrong-key" });
    expect(response.ok).toBe(false);
  });

  it("allows requests with the configured API key", async () => {
    const initResponse = await initialize({ "x-api-key": "test-http-key" });
    const initPayload = await readRpcBody(initResponse);

    expect(initResponse.ok).toBe(true);
    expect(initPayload).toHaveProperty("result.serverInfo.name", "Capy MCP Server");

    const authorizedHeaders = {
      "x-api-key": "test-http-key"
    };

    const initializedResponse = await notifyInitialized(authorizedHeaders);
    expect(initializedResponse.ok).toBe(true);

    const listResponse = await toolsList(authorizedHeaders);
    const listPayload = await readRpcBody(listResponse);

    expect(listResponse.ok).toBe(true);
    expect(listPayload).toHaveProperty("result.tools");
    expect(listPayload.result.tools.some((tool: { name: string }) => tool.name === "models_list")).toBe(true);
  });
});
