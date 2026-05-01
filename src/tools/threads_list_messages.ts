import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { cursorSchema } from "../lib/capy/tool-schemas";
import { structured } from "../lib/capy/tool-helpers";

const defaultLimit = 10;
const maxLimit = 20;

export const schema = {
  threadId: z.string().describe("Capy thread ID."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(maxLimit)
    .optional()
    .describe(`Maximum number of messages to return per page. Defaults to ${defaultLimit}.`),
  cursor: cursorSchema
};

export const metadata: ToolMetadata = {
  name: "threads_list_messages",
  description:
    "List messages in a Capy thread with pagination. Read this incrementally in small pages rather than requesting a large transcript at once.",
  annotations: {
    title: "List Thread Messages",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function threadsListMessages({
  threadId,
  limit = defaultLimit,
  ...query
}: InferSchema<typeof schema>) {
  const client = getCapyClient();
  const response = await client.listThreadMessages({ threadId }, { ...query, limit });
  return structured(response);
}
