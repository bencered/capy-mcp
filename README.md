# Capy MCP Server

MCP server for the supported Capy API surface:

- projects
- models
- threads
- browser snapshots

Task tools are intentionally not exposed. Use threads for interactive work.

## Install

```bash
npm install -g capy-xmcp-server
```

## Requirements

- Node.js 20+
- `CAPY_API_TOKEN` for the upstream Capy API

For HTTP transport, also set:

- `XMCP_HTTP_API_KEY`

## Run

STDIO transport:

```bash
CAPY_API_TOKEN=... capy-xmcp-server stdio
```

HTTP transport:

```bash
CAPY_API_TOKEN=... XMCP_HTTP_API_KEY=... capy-xmcp-server http
```

The HTTP server binds to `127.0.0.1:3001/mcp` by default.
