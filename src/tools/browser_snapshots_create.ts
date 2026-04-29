import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { browserSnapshotStorageStateSchema } from "../lib/capy/tool-schemas";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID that will own the new browser snapshot."),
  name: z.string().min(1).max(255).describe("Name for the browser snapshot."),
  storageState: browserSnapshotStorageStateSchema.describe("Browser storage state to save in the snapshot."),
  isPrivate: z.boolean().optional().describe("Whether the snapshot should be private to its creator."),
  isDefault: z.boolean().optional().describe("Whether the snapshot should become the default snapshot.")
};

export const metadata: ToolMetadata = {
  name: "browser_snapshots_create",
  description: "Create a new browser snapshot with cookies and localStorage state.",
  annotations: {
    title: "Create Browser Snapshot",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false
  }
};

export default async function browserSnapshotsCreate({
  projectId,
  ...body
}: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.createBrowserSnapshot({ projectId }, body));
}
