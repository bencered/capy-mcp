import { CapyClient } from "../src/lib/capy/client";
import { getCapyEnv } from "../src/lib/capy/env";
import { CapyApiError, parseCapyError } from "../src/lib/capy/error";
import { serializeQuery } from "../src/lib/capy/query";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

describe("capy env", () => {
  it("reads the token and normalizes the base url", () => {
    const env = getCapyEnv({
      CAPY_API_TOKEN: "capy_test",
      CAPY_BASE_URL: "https://example.com/api/"
    });

    expect(env).toEqual({
      apiToken: "capy_test",
      baseUrl: "https://example.com/api"
    });
  });

  it("uses the documented default base url", () => {
    const env = getCapyEnv({
      CAPY_API_TOKEN: "capy_test"
    });

    expect(env.baseUrl).toBe("https://capy.ai/api");
  });

  it("rejects missing CAPY_API_TOKEN", () => {
    expect(() => getCapyEnv({})).toThrow("CAPY_API_TOKEN is required");
  });
});

describe("query serialization", () => {
  it("serializes primitives and arrays while omitting nullish values", () => {
    const query = serializeQuery({
      limit: 20,
      cursor: "abc",
      include: ["one", "two"],
      skip: undefined,
      drop: null,
      enabled: false
    });

    expect(query).toBe("limit=20&cursor=abc&include=one&include=two&enabled=false");
  });
});

describe("capy errors", () => {
  it("preserves status, code, message, and details", async () => {
    const error = await parseCapyError(
      jsonResponse(
        {
          error: {
            code: "validation_error",
            message: "Bad input",
            details: {
              field: "projectId"
            }
          }
        },
        422
      )
    );

    expect(error).toBeInstanceOf(CapyApiError);
    expect(error.status).toBe(422);
    expect(error.code).toBe("validation_error");
    expect(error.message).toBe("Bad input");
    expect(error.details).toEqual({ field: "projectId" });
  });
});

describe("capy client", () => {
  it("injects bearer auth and JSON headers", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ models: [] }) as unknown as Response);
    const client = new CapyClient({
      apiToken: "capy_test",
      baseUrl: "https://example.com/api"
    });

    await client.listModels();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBeInstanceOf(URL);
    expect((url as URL).toString()).toBe("https://example.com/api/v1/models");
    expect(init).toMatchObject({
      method: "GET",
      headers: {
        Authorization: "Bearer capy_test",
        Accept: "application/json"
      }
    });
  });
});

