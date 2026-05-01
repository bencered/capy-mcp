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

```bash
claude mcp add capy --scope user --env CAPY_API_TOKEN=<your_token> -- npx -y @bencered/capy-mcp@0.1.1 stdio
```

## Requirements

- Node.js 20+
- `CAPY_API_TOKEN` for the upstream Capy API
