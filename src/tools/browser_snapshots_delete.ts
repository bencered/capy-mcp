import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID that owns the browser snapshot."),
  snapshotId: z.string().describe("Browser snapshot ID.")
};

export const metadata: ToolMetadata = {
  name: "browser_snapshots_delete",
  description: "Delete a browser snapshot.",
  annotations: {
    title: "Delete Browser Snapshot",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false
  }
};

export default async function browserSnapshotsDelete({ projectId, snapshotId }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.deleteBrowserSnapshot({ projectId, snapshotId }));
}
