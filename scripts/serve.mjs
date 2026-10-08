// Zero-dependency static server for local development and browser tests.
// Usage: node scripts/serve.mjs [port]
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.argv[2] ?? process.env.PORT ?? 8000);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".py": "text/x-python; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

export function startServer(listenPort = port) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let path = normalize(join(root, decodeURIComponent(url.pathname)));
      if (!path.startsWith(root)) throw Object.assign(new Error("Forbidden"), { status: 403 });
      if ((await stat(path)).isDirectory()) path = join(path, "index.html");
      await stat(path);
      res.writeHead(200, { "Content-Type": TYPES[extname(path)] ?? "application/octet-stream", "Cache-Control": "no-store" });
      createReadStream(path).pipe(res);
    } catch (err) {
      res.writeHead(err.status ?? 404, { "Content-Type": "text/plain" });
      res.end(err.status === 403 ? "Forbidden" : "Not found");
    }
  });
  return new Promise((resolveListen) => server.listen(listenPort, "127.0.0.1", () => resolveListen(server)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await startServer();
  console.log(`PyQuest running at http://127.0.0.1:${port}/`);
}
