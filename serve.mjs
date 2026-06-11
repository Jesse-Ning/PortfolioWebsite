import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime"
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const normalized = normalize(pathname === "/" ? "/index.html" : pathname);
  const filePath = join(root, normalized);
  return filePath.startsWith(root) ? filePath : null;
}


const uploadKinds = {
  images: new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]),
  documents: new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"]),
  videos: new Set([".mp4", ".webm", ".mov"]),
  files: new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".mp4", ".webm", ".mov"])
};

function safeFileSlug(value) {
  const base = String(value || "asset")
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "asset";
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;,]+)?(?:;[^,]*)?;base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");
  return Buffer.from(match[2], "base64");
}

async function saveUploadedAsset(upload) {
  const kind = uploadKinds[upload.kind] ? upload.kind : "files";
  const extension = extname(String(upload.fileName || "")).toLowerCase();
  if (!extension || !uploadKinds[kind].has(extension)) {
    throw new Error(`Unsupported ${kind} file type`);
  }

  const bytes = parseDataUrl(upload.dataUrl);
  const folder = join(root, "assets", "uploads", kind);
  await mkdir(folder, { recursive: true });

  const safeName = `${Date.now()}-${safeFileSlug(upload.fileName)}${extension}`;
  const filePath = join(folder, safeName);
  await writeFile(filePath, bytes);
  return `assets/uploads/${kind}/${safeName}`;
}
function readJsonBody(request, maxBytes = 80 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/upload") {
    try {
      const upload = await readJsonBody(request, 220 * 1024 * 1024);
      const path = await saveUploadedAsset(upload);
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: true, path }));
    } catch (error) {
      response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: false, error: error.message }));
    }
    return;
  }
  if (request.method === "POST" && request.url === "/api/content") {
    try {
      const content = await readJsonBody(request);
      await writeFile(join(root, "content.json"), `${JSON.stringify(content, null, 2)}\n`, "utf8");
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: true }));
    } catch (error) {
      response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ ok: false, error: error.message }));
    }
    return;
  }

  const filePath = resolveRequestPath(request.url || "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Portfolio preview running at http://${host}:${port}`);
});
