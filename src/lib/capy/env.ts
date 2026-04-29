export interface CapyEnv {
  apiToken: string;
  baseUrl: string;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function getCapyEnv(env: NodeJS.ProcessEnv = process.env): CapyEnv {
  const apiToken = env.CAPY_API_TOKEN;

  if (!apiToken) {
    throw new Error("CAPY_API_TOKEN is required");
  }

  return {
    apiToken,
    baseUrl: normalizeBaseUrl(env.CAPY_BASE_URL ?? "https://capy.ai/api")
  };
}

