interface CapyErrorPayload {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export class CapyApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly details: unknown;

  constructor(input: { status: number; code?: string | null; message: string; details?: unknown }) {
    super(input.message);
    this.name = "CapyApiError";
    this.status = input.status;
    this.code = input.code ?? null;
    this.details = input.details;
  }
}

export async function parseCapyError(response: Response): Promise<CapyApiError> {
  let payload: CapyErrorPayload | null = null;

  try {
    payload = (await response.json()) as CapyErrorPayload;
  } catch {
    payload = null;
  }

  return new CapyApiError({
    status: response.status,
    code: payload?.error?.code ?? null,
    message: payload?.error?.message ?? `Capy API request failed with status ${response.status}`,
    details: payload?.error?.details
  });
}

