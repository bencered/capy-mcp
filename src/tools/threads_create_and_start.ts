import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";
import { reasoningSchema, repoSchema, speedValues } from "../lib/capy/tool-schemas";

export const schema = {
  projectId: z.string().describe("Capy project ID that will own the new thread."),
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
  attachmentUrls: z
    .array(z.string().url())
    .optional()
    .describe("Optional attachment URLs to send with the thread prompt.")
};

export const metadata: ToolMetadata = {
  name: "threads_create_and_start",
  description:
    "Create a new Capy thread and immediately start execution. Use this when beginning a new unit of work inside a project.",
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
