import * as modelsList from "../src/tools/models_list";
import * as projectsGet from "../src/tools/projects_get";
import * as projectsList from "../src/tools/projects_list";
import * as threadsCreateAndStart from "../src/tools/threads_create_and_start";
import * as threadsGet from "../src/tools/threads_get";
import * as threadsList from "../src/tools/threads_list";
import * as threadsListMessages from "../src/tools/threads_list_messages";
import * as threadsSendMessage from "../src/tools/threads_send_message";
import * as threadsStop from "../src/tools/threads_stop";

import { CapyApiError } from "../src/lib/capy/error";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

type ToolCase = {
  name: string;
  run: () => Promise<unknown>;
  path: string;
  method: string;
  response: unknown;
  body?: unknown;
  readOnly: boolean;
  destructive: boolean;
  idempotent: boolean;
  metadata: {
    annotations?: {
      readOnlyHint?: boolean;
      destructiveHint?: boolean;
      idempotentHint?: boolean;
    };
  };
};

const createThreadResponse = {
  id: "jam_123",
  projectId: "proj_123",
  title: "Thread",
  status: "active",
  createdAt: "2026-04-29T00:00:00.000Z"
};

const threadResponse = {
  id: "jam_123",
  projectId: "proj_123",
  title: "Thread",
  status: "active",
  tasks: [],
  pullRequests: [],
  slackThreads: [],
  createdAt: "2026-04-29T00:00:00.000Z",
  updatedAt: "2026-04-29T00:00:00.000Z"
};

const toolCases: ToolCase[] = [
  {
    name: "projects_list",
    run: () => projectsList.default({ limit: 10, cursor: "cursor_123" }),
    path: "/v1/projects?limit=10&cursor=cursor_123",
    method: "GET",
    response: { items: [], nextCursor: null, hasMore: false },
    readOnly: true,
    destructive: false,
    idempotent: true,
    metadata: projectsList.metadata
  },
  {
    name: "projects_get",
    run: () => projectsGet.default({ projectId: "proj_123" }),
    path: "/v1/projects/proj_123",
    method: "GET",
    response: {
      id: "proj_123",
      name: "Project",
      description: null,
      taskCode: "SCO",
      repos: [],
      createdAt: "2026-04-29T00:00:00.000Z",
      updatedAt: "2026-04-29T00:00:00.000Z"
    },
    readOnly: true,
    destructive: false,
    idempotent: true,
    metadata: projectsGet.metadata
  },
  {
    name: "models_list",
    run: () => modelsList.default(),
    path: "/v1/models",
    method: "GET",
    response: { models: [] },
    readOnly: true,
    destructive: false,
    idempotent: true,
    metadata: modelsList.metadata
  },
  {
    name: "threads_list",
    run: () =>
      threadsList.default(
        { projectId: "proj_123", status: "active", limit: 5 } as Parameters<typeof threadsList.default>[0]
      ),
    path: "/v1/threads?projectId=proj_123&status=active&limit=5",
    method: "GET",
    response: { items: [], nextCursor: null, hasMore: false },
    readOnly: true,
    destructive: false,
    idempotent: true,
    metadata: threadsList.metadata
  },
  {
    name: "threads_get",
    run: () => threadsGet.default({ threadId: "jam_123" }),
    path: "/v1/threads/jam_123",
    method: "GET",
    response: threadResponse,
    readOnly: true,
    destructive: false,
    idempotent: true,
    metadata: threadsGet.metadata
  },
  {
    name: "threads_create_and_start",
    run: () =>
      threadsCreateAndStart.default(
        {
          projectId: "proj_123",
          prompt: "Build a feature",
          model: "gpt-5.5",
          speed: "fast"
        } as Parameters<typeof threadsCreateAndStart.default>[0]
      ),
    path: "/v1/threads",
    method: "POST",
    body: {
      projectId: "proj_123",
      prompt: "Build a feature",
      model: "gpt-5.5",
      speed: "fast"
    },
    response: createThreadResponse,
    readOnly: false,
    destructive: false,
    idempotent: false,
    metadata: threadsCreateAndStart.metadata
  },
  {
    name: "threads_send_message",
    run: () =>
      threadsSendMessage.default(
        {
          threadId: "jam_123",
          message: "Continue",
          buildSpeed: "standard"
        } as Parameters<typeof threadsSendMessage.default>[0]
      ),
    path: "/v1/threads/jam_123/message",
    method: "POST",
    body: {
      message: "Continue",
      buildSpeed: "standard"
    },
    response: { id: "msg_123", status: "sent" },
    readOnly: false,
    destructive: false,
    idempotent: false,
    metadata: threadsSendMessage.metadata
  },
  {
    name: "threads_list_messages",
    run: () =>
      threadsListMessages.default({
        threadId: "jam_123",
        limit: 2,
        cursor: "next_123"
      }),
    path: "/v1/threads/jam_123/messages?cursor=next_123&limit=2",
    method: "GET",
    response: {
      items: [
        {
          id: "msg_1",
          source: "assistant",
          content: "0123456789ABCDEFGHIJ",
          createdAt: "2026-04-29T00:00:00.000Z"
        },
        {
          id: "msg_2",
          source: "user",
          content: "short",
          createdAt: "2026-04-29T00:01:00.000Z"
        }
      ],
      nextCursor: null,
      hasMore: false
    },
    readOnly: true,
    destructive: false,
    idempotent: true,
    metadata: threadsListMessages.metadata
  },
  {
    name: "threads_stop",
    run: () => threadsStop.default({ threadId: "jam_123" }),
    path: "/v1/threads/jam_123/stop",
    method: "POST",
    response: { id: "jam_123", status: "idle" },
    readOnly: false,
    destructive: false,
    idempotent: false,
    metadata: threadsStop.metadata
  }
];

describe("tool metadata", () => {
  it.each(toolCases)("%s exposes the expected metadata hints", ({ metadata, readOnly, destructive, idempotent }) => {
    expect(metadata.annotations?.readOnlyHint).toBe(readOnly);
    expect(metadata.annotations?.destructiveHint).toBe(destructive);
    expect(metadata.annotations?.idempotentHint).toBe(idempotent);
  });
});

describe("tool handlers", () => {
  beforeEach(() => {
    process.env.CAPY_API_TOKEN = "capy_test";
    delete process.env.CAPY_BASE_URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(toolCases)("%s sends the documented request and returns structured content", async (testCase) => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse(testCase.response) as unknown as Response);

    const result = await testCase.run();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect((url as URL).toString()).toBe(`https://capy.ai/api${testCase.path}`);
    expect(init?.method).toBe(testCase.method);

    if (testCase.body) {
      expect(JSON.parse(String(init?.body))).toEqual(testCase.body);
    } else {
      expect(init?.body).toBeUndefined();
    }

    expect(result).toEqual({
      structuredContent: testCase.response
    });
  });

  it.each(toolCases)("%s maps non-200 responses to CapyApiError", async (testCase) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "not_found",
            message: `${testCase.name} failed`
          }
        },
        404
      ) as unknown as Response
    );

    const promise = testCase.run();

    await expect(promise).rejects.toBeInstanceOf(CapyApiError);
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: "not_found",
      message: `${testCase.name} failed`
    });
  });
});
