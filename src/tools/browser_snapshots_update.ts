import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID that owns the browser snapshot."),
  snapshotId: z.string().describe("Browser snapshot ID."),
  name: z.string().min(1).max(255).optional().describe("Updated snapshot name."),
  isPrivate: z.boolean().optional().describe("Updated privacy flag."),
  isDefault: z.boolean().optional().describe("Updated default flag.")
};

export const metadata: ToolMetadata = {
  name: "browser_snapshots_update",
  description: "Update browser snapshot metadata.",
  annotations: {
    title: "Update Browser Snapshot",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false
  }
};

export default async function browserSnapshotsUpdate({
  projectId,
  snapshotId,
  ...body
}: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.updateBrowserSnapshot({ projectId, snapshotId }, body));
}
