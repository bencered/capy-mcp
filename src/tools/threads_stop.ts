import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  threadId: z.string().describe("Thread jam ID, for example jam_123.")
};

export const metadata: ToolMetadata = {
  name: "threads_stop",
  description: "Stop an actively running captain thread.",
  annotations: {
    title: "Stop Thread",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false
  }
};

export default async function threadsStop({ threadId }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.stopThread({ threadId }));
}
