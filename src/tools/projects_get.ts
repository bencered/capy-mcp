import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  projectId: z.string().describe("Project ID, for example proj_123.")
};

export const metadata: ToolMetadata = {
  name: "projects_get",
  description: "Get one Capy project. Projects are the top-level container that own threads.",
  annotations: {
    title: "Get Project",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function projectsGet({ projectId }: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.getProject({ projectId }));
}
