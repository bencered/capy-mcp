import { type InferSchema, type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { cursorSchema, limitSchema } from "../lib/capy/tool-schemas";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {
  limit: limitSchema,
  cursor: cursorSchema
};

export const metadata: ToolMetadata = {
  name: "projects_list",
  description: "List projects available to the API token.",
  annotations: {
    title: "List Projects",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function projectsList(args: InferSchema<typeof schema>) {
  const client = getCapyClient();
  return structured(await client.listProjects(args));
}
