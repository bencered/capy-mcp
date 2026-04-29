import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID that owns the browser snapshot."),
  snapshotId: z.string().describe("Browser snapshot ID.")
};

export const metadata: ToolMetadata = {
  name: "browser_snapshots_get",
  description: "Get a browser snapshot by ID including its full storage state.",
  annotations: {
    title: "Get Browser Snapshot",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function browserSnapshotsGet({ projectId, snapshotId }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.getBrowserSnapshot({ projectId, snapshotId }));
}
