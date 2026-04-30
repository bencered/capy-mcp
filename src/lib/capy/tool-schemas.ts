import { z } from "zod";

export const speedValues = ["fast", "standard"] as const;
export const reasoningModeValues = ["off", "on", "none", "minimal", "low", "medium", "high", "xhigh"] as const;
export const threadStatusValues = ["active", "idle", "archived"] as const;
export const diffModeValues = ["run", "uncommitted", "pr"] as const;

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
