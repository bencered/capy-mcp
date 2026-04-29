import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID whose browser snapshots should be listed.")
};

export const metadata: ToolMetadata = {
  name: "browser_snapshots_list",
  description: "List browser snapshots for a project.",
  annotations: {
    title: "List Browser Snapshots",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function browserSnapshotsList({ projectId }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.listBrowserSnapshots({ projectId }));
}
