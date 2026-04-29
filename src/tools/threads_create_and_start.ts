import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";
import { reasoningSchema, repoSchema, speedValues } from "../lib/capy/tool-schemas";

export const schema = {
  projectId: z.string().describe("Project ID that owns the new captain thread."),
  prompt: z.string().min(1).describe("Prompt to send when creating and starting the thread."),
  model: z
    .string()
    .optional()
    .describe("Optional model ID. Call models_list first to discover valid model values."),
  speed: z.enum(speedValues).optional().describe("Optional speed setting."),
  reasoning: reasoningSchema.optional(),
  buildModel: z
    .string()
    .optional()
    .describe("Optional Build model ID. Call models_list first to discover valid model values."),
  buildSpeed: z.enum(speedValues).optional().describe("Optional Build speed setting."),
  buildReasoning: reasoningSchema.optional(),
  repos: z.array(repoSchema).optional().describe("Optional repository branch overrides."),
  browserSnapshotIds: z
    .array(z.string())
    .optional()
    .describe("Optional browser snapshot IDs to inject into the thread session."),
  attachmentUrls: z
    .array(z.string().url())
    .optional()
    .describe("Optional attachment URLs to send with the thread prompt.")
};

export const metadata: ToolMetadata = {
  name: "threads_create_and_start",
  description: "Create a new captain thread and immediately start execution.",
  annotations: {
    title: "Create And Start Thread",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false
  }
};

export default async function threadsCreateAndStart(args: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.createAndStartThread(args));
}
