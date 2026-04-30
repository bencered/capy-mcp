import type { components, operations } from "./generated/openapi";

export type CapyComponents = components;
export type CapyOperations = operations;
export type CapySpeed = "fast" | "standard";
export type CapyReasoningMode = "off" | "on" | "none" | "minimal" | "low" | "medium" | "high" | "xhigh";

export interface CapyReasoningConfig {
  mode: CapyReasoningMode;
}

export interface ThreadRepoSelection {
  repoFullName: string;
  branch: string;
}

export interface ThreadCreateInput {
  projectId: string;
  prompt: string;
  model?: string;
  speed?: CapySpeed;
  reasoning?: CapyReasoningConfig;
  buildModel?: string;
  buildSpeed?: CapySpeed;
  buildReasoning?: CapyReasoningConfig;
  repos?: ThreadRepoSelection[];
  attachmentUrls?: string[];
}

export interface ThreadSendMessageInput {
  message: string;
  model?: string;
  speed?: CapySpeed;
  reasoning?: CapyReasoningConfig;
  buildModel?: string;
  buildSpeed?: CapySpeed;
  buildReasoning?: CapyReasoningConfig;
  attachmentUrls?: string[];
}

type JsonResponse<T> = T extends {
  responses: {
    200: {
      content: {
        "application/json": infer Body;
      };
    };
  };
}
  ? Body
  : never;

type QueryParams<T> = T extends {
  parameters: {
    query: infer Query;
  };
}
  ? Query
  : T extends {
        parameters: {
          query?: infer OptionalQuery;
        };
      }
    ? OptionalQuery
    : never;

type PathParams<T> = T extends {
  parameters: {
    path: infer Path;
  };
}
  ? Path
  : never;

export type ListProjectsQuery = QueryParams<operations["listProjects"]>;
export type ListProjectsResponse = JsonResponse<operations["listProjects"]>;
export type GetProjectPath = PathParams<operations["getProject"]>;
export type Project = JsonResponse<operations["getProject"]>;
export type ListModelsResponse = JsonResponse<operations["listModels"]>;

export type ListThreadsQuery = QueryParams<operations["listThreads"]>;
export type ListThreadsResponse = JsonResponse<operations["listThreads"]>;
export type GetThreadPath = PathParams<operations["getThread"]>;
export type Thread = JsonResponse<operations["getThread"]>;
export type CreateThreadResponse = JsonResponse<operations["createAndStartThread"]>;
export type StopThreadPath = PathParams<operations["stopThread"]>;
export type StopThreadResponse = JsonResponse<operations["stopThread"]>;
export type SendThreadMessagePath = PathParams<operations["sendThreadMessage"]>;
export type SendMessageResponse = JsonResponse<operations["sendThreadMessage"]>;
export type ListThreadMessagesPath = PathParams<operations["listThreadMessages"]>;
export type ListThreadMessagesQuery = QueryParams<operations["listThreadMessages"]>;
export type ListMessagesResponse = JsonResponse<operations["listThreadMessages"]>;
