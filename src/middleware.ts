import { timingSafeEqual } from "node:crypto";

import { apiKeyAuthMiddleware } from "xmcp";

function isValidApiKey(apiKey: string, expected: string): boolean {
  const incoming = Buffer.from(apiKey);
  const target = Buffer.from(expected);

  if (incoming.length !== target.length) {
    return false;
  }

  return timingSafeEqual(incoming, target);
}

const middleware = apiKeyAuthMiddleware({
  headerName: "x-api-key",
  validateApiKey: async (apiKey) => {
    const expected = process.env.XMCP_HTTP_API_KEY;

    if (!expected) {
      return false;
    }

    return isValidApiKey(apiKey, expected);
  }
});

export default middleware;
