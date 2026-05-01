import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  threadId: z.string().describe("Capy thread ID.")
};

export const metadata: ToolMetadata = {
  name: "threads_get",
  description: "Get the current state of a single Capy thread, including status and linked work artifacts.",
  annotations: {
    title: "Get Thread",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function threadsGet({ threadId }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.getThread({ threadId }));
}
