import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";
import { reasoningSchema, speedValues } from "../lib/capy/tool-schemas";

export const schema = {
  threadId: z.string().describe("Thread jam ID, for example jam_123."),
  message: z.string().min(1).describe("Message to send to the existing thread."),
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
  attachmentUrls: z
    .array(z.string().url())
    .optional()
    .describe("Optional attachment URLs to send with the message.")
};

export const metadata: ToolMetadata = {
  name: "threads_send_message",
  description: "Send a message to an existing thread.",
  annotations: {
    title: "Send Thread Message",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false
  }
};

export default async function threadsSendMessage({ threadId, ...body }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.sendThreadMessage({ threadId }, body));
}
