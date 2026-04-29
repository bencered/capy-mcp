import { CapyClient } from "../../src/lib/capy/client";

const runLiveTests = process.env.RUN_LIVE_TESTS === "1";
const liveProjectId = process.env.CAPY_LIVE_PROJECT_ID;

describe.skipIf(!runLiveTests || !process.env.CAPY_API_TOKEN || !liveProjectId)("live capy integration", () => {
  const client = new CapyClient();

  it("lists models", async () => {
    const response = await client.listModels();
    expect(Array.isArray(response.models)).toBe(true);
  });

  it("lists and gets the configured project", async () => {
    const projects = await client.listProjects({ limit: 20 });
    const project = await client.getProject({ projectId: liveProjectId! });

    expect(projects.items.some((item: { id: string }) => item.id === liveProjectId)).toBe(true);
    expect(project.id).toBe(liveProjectId);
  });

  it("creates, inspects, messages, lists messages for, and stops a thread", async () => {
    const thread = await client.createAndStartThread({
      projectId: liveProjectId!,
      prompt: "Reply with the single word ack."
    });

    expect(thread.projectId).toBe(liveProjectId);

    const fetched = await client.getThread({ threadId: thread.id });
    expect(fetched.id).toBe(thread.id);

    const sent = await client.sendThreadMessage(
      { threadId: thread.id },
      { message: "Stop after acknowledging this live test." }
    );
    expect(sent.status).toBe("sent");

    const messages = await client.listThreadMessages({ threadId: thread.id }, { limit: 10 });
    expect(Array.isArray(messages.items)).toBe(true);

    const stopped = await client.stopThread({ threadId: thread.id });
    expect(stopped.id).toBe(thread.id);
  }, 60000);

  it("creates, updates, retrieves, and deletes a browser snapshot", async () => {
    const created = await client.createBrowserSnapshot(
      { projectId: liveProjectId! },
      {
        name: `xmcp-live-${Date.now()}`,
        storageState: {
          cookies: [],
          origins: []
        }
      }
    );

    expect(created.projectId).toBe(liveProjectId);

    const updated = await client.updateBrowserSnapshot(
      { projectId: liveProjectId!, snapshotId: created.id },
      { name: `${created.name}-updated` }
    );
    expect(updated.id).toBe(created.id);

    const fetched = await client.getBrowserSnapshot({
      projectId: liveProjectId!,
      snapshotId: created.id
    });
    expect(fetched.id).toBe(created.id);

    const deleted = await client.deleteBrowserSnapshot({
      projectId: liveProjectId!,
      snapshotId: created.id
    });
    expect(deleted.success).toBe(true);
  }, 60000);
});
