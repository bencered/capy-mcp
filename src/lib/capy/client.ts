import { getCapyEnv, type CapyEnv } from "./env";
import { parseCapyError } from "./error";
import { serializeQuery, type QueryValue } from "./query";
import type {
  BrowserSnapshotDetail,
  CreateBrowserSnapshotBody,
  CreateThreadResponse,
  DeleteBrowserSnapshotResponse,
  GetBrowserSnapshotPath,
  GetProjectPath,
  ListBrowserSnapshotsPath,
  ListBrowserSnapshotsResponse,
  ListMessagesResponse,
  ListModelsResponse,
  ListProjectsQuery,
  ListProjectsResponse,
  ListThreadMessagesPath,
  ListThreadMessagesQuery,
  ListThreadsQuery,
  ListThreadsResponse,
  Project,
  SendMessageResponse,
  SendThreadMessagePath,
  StopThreadPath,
  StopThreadResponse,
  ThreadCreateInput,
  ThreadSendMessageInput,
  Thread,
  UpdateBrowserSnapshotBody,
  UpdateBrowserSnapshotPath
} from "./types";

interface RequestOptions {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
}

export class CapyClient {
  constructor(private readonly env: CapyEnv = getCapyEnv()) {}

  async listProjects(query: ListProjectsQuery = {}): Promise<ListProjectsResponse> {
    return this.request({
      method: "GET",
      path: "/v1/projects",
      query
    });
  }

  async getProject(path: GetProjectPath): Promise<Project> {
    return this.request({
      method: "GET",
      path: `/v1/projects/${encodeURIComponent(path.projectId)}`
    });
  }

  async listModels(): Promise<ListModelsResponse> {
    return this.request({
      method: "GET",
      path: "/v1/models"
    });
  }

  async listThreads(query: ListThreadsQuery): Promise<ListThreadsResponse> {
    return this.request({
      method: "GET",
      path: "/v1/threads",
      query
    });
  }

  async getThread(path: { threadId: string }): Promise<Thread> {
    return this.request({
      method: "GET",
      path: `/v1/threads/${encodeURIComponent(path.threadId)}`
    });
  }

  async createAndStartThread(body: ThreadCreateInput): Promise<CreateThreadResponse> {
    return this.request({
      method: "POST",
      path: "/v1/threads",
      body
    });
  }

  async sendThreadMessage(path: SendThreadMessagePath, body: ThreadSendMessageInput): Promise<SendMessageResponse> {
    return this.request({
      method: "POST",
      path: `/v1/threads/${encodeURIComponent(path.threadId)}/message`,
      body
    });
  }

  async listThreadMessages(
    path: ListThreadMessagesPath,
    query: ListThreadMessagesQuery = {}
  ): Promise<ListMessagesResponse> {
    return this.request({
      method: "GET",
      path: `/v1/threads/${encodeURIComponent(path.threadId)}/messages`,
      query
    });
  }

  async stopThread(path: StopThreadPath): Promise<StopThreadResponse> {
    return this.request({
      method: "POST",
      path: `/v1/threads/${encodeURIComponent(path.threadId)}/stop`
    });
  }

  async listBrowserSnapshots(path: ListBrowserSnapshotsPath): Promise<ListBrowserSnapshotsResponse> {
    return this.request({
      method: "GET",
      path: `/v1/projects/${encodeURIComponent(path.projectId)}/browser-snapshots`
    });
  }

  async getBrowserSnapshot(path: GetBrowserSnapshotPath): Promise<BrowserSnapshotDetail> {
    return this.request({
      method: "GET",
      path: `/v1/projects/${encodeURIComponent(path.projectId)}/browser-snapshots/${encodeURIComponent(path.snapshotId)}`
    });
  }

  async createBrowserSnapshot(
    path: ListBrowserSnapshotsPath,
    body: CreateBrowserSnapshotBody
  ): Promise<BrowserSnapshotDetail> {
    return this.request({
      method: "POST",
      path: `/v1/projects/${encodeURIComponent(path.projectId)}/browser-snapshots`,
      body
    });
  }

  async updateBrowserSnapshot(
    path: UpdateBrowserSnapshotPath,
    body: UpdateBrowserSnapshotBody
  ): Promise<BrowserSnapshotDetail> {
    return this.request({
      method: "PATCH",
      path: `/v1/projects/${encodeURIComponent(path.projectId)}/browser-snapshots/${encodeURIComponent(path.snapshotId)}`,
      body
    });
  }

  async deleteBrowserSnapshot(path: GetBrowserSnapshotPath): Promise<DeleteBrowserSnapshotResponse> {
    return this.request({
      method: "DELETE",
      path: `/v1/projects/${encodeURIComponent(path.projectId)}/browser-snapshots/${encodeURIComponent(path.snapshotId)}`
    });
  }

  private async request<T>({ method, path, query, body }: RequestOptions): Promise<T> {
    const url = new URL(`${this.env.baseUrl}${path}`);
    const serialized = serializeQuery(query);

    if (serialized) {
      url.search = serialized;
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.env.apiToken}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });

    if (!response.ok) {
      throw await parseCapyError(response);
    }

    return (await response.json()) as T;
  }
}

export function getCapyClient(): CapyClient {
  return new CapyClient();
}
