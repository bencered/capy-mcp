import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { cursorSchema, limitSchema, threadStatusValues } from "../lib/capy/tool-schemas";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID whose captain threads should be listed."),
  limit: limitSchema,
  cursor: cursorSchema,
  status: z.enum(threadStatusValues).optional().describe("Optional thread status filter."),
  prNumber: z.number().int().optional().describe("Optional pull request number filter."),
  branch: z.string().optional().describe("Optional branch name filter."),
  slackThreadTs: z.string().optional().describe("Optional Slack thread timestamp filter.")
};

export const metadata: ToolMetadata = {
  name: "threads_list",
  description: "List captain threads for a project.",
  annotations: {
    title: "List Threads",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function threadsList(args: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.listThreads(args));
}
