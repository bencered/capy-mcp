# `@bencered/capy-mcp`

Unofficial MCP server for the supported Capy API surface.

This package is not affiliated with, endorsed by, or maintained by Capy.

Supported surface:

- projects
- models
- threads

Task tools and browser snapshot tools are intentionally not exposed. Use threads for interactive work.

## License

MIT. See [LICENSE](./LICENSE).

## Install

```bash
npm install -g @bencered/capy-mcp
```

## Requirements

- Node.js 20+
- `CAPY_API_TOKEN` for the upstream Capy API

For HTTP transport, also set:

- `XMCP_HTTP_API_KEY`

## Run

STDIO transport:

```bash
CAPY_API_TOKEN=... capy-mcp stdio
```

HTTP transport:

```bash
CAPY_API_TOKEN=... XMCP_HTTP_API_KEY=... capy-mcp http
```

The HTTP server binds to `127.0.0.1:3001/mcp` by default.
