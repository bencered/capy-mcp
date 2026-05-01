import { type ToolMetadata } from "xmcp";

import { getCapyClient } from "../lib/capy/client";
import { structured } from "../lib/capy/tool-helpers";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "models_list",
  description: "List Capy model IDs available to this API token. Call this before choosing model or buildModel values for thread operations.",
  annotations: {
    title: "List Models",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true
  }
};

export default async function modelsList() {
  const client = getCapyClient();
  return structured(await client.listModels());
}
