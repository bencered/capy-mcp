import { z } from "zod";

export const speedValues = ["fast", "standard"] as const;
export const reasoningModeValues = ["off", "on", "none", "minimal", "low", "medium", "high", "xhigh"] as const;
export const threadStatusValues = ["active", "idle", "archived"] as const;
export const diffModeValues = ["run", "uncommitted", "pr"] as const;
export const sameSiteValues = ["Strict", "Lax", "None"] as const;

export const limitSchema = z
  .number()
  .int()
  .min(1)
  .max(100)
  .optional()
  .describe("Maximum number of items to return.");

export const cursorSchema = z
  .string()
  .optional()
  .describe("Opaque pagination cursor returned by a previous list call.");

export const reasoningSchema = z
  .object({
    mode: z
      .enum(reasoningModeValues)
      .describe("Reasoning mode to use for the model invocation.")
  })
  .describe("Reasoning configuration.");

export const repoSchema = z
  .object({
    repoFullName: z.string().describe("GitHub repository in owner/name format."),
    branch: z.string().describe("Branch name to use for this repository.")
  })
  .describe("Repository override for the thread.");

export const browserSnapshotCookieSchema = z.object({
  name: z.string().describe("Cookie name."),
  value: z.string().describe("Cookie value."),
  domain: z.string().describe("Cookie domain."),
  path: z.string().describe("Cookie path."),
  expires: z.number().describe("Cookie expiry timestamp as a Unix time in seconds."),
  httpOnly: z.boolean().describe("Whether the cookie is HTTP-only."),
  secure: z.boolean().describe("Whether the cookie requires HTTPS."),
  sameSite: z.enum(sameSiteValues).describe("Cookie sameSite value.")
});

export const browserSnapshotLocalStorageItemSchema = z.object({
  name: z.string().describe("LocalStorage key."),
  value: z.string().describe("LocalStorage value.")
});

export const browserSnapshotOriginSchema = z.object({
  origin: z.string().describe("Origin URL for the storage entries."),
  localStorage: z
    .array(browserSnapshotLocalStorageItemSchema)
    .describe("LocalStorage items for the origin.")
});

export const browserSnapshotStorageStateSchema = z.object({
  cookies: z.array(browserSnapshotCookieSchema).describe("Cookies to inject into the browser session."),
  origins: z
    .array(browserSnapshotOriginSchema)
    .describe("Origin-specific localStorage state to inject into the browser session.")
});
