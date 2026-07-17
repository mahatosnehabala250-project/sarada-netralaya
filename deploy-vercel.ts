import { readFileSync, statSync, readdirSync } from "fs";
import { join, relative } from "path";
const TOKEN = "vcp_6UOyTFYWkIr6pj28SgmY0pxfAsJ3bf69I8nqHOPdPBAr3y4wr1uTIzI";
const TEAM = "team_WCPKpOJgwOIHSWjilzgSm1CP";
const PROJECT = "prj_6BKmjMeRUtVdTeFYonrpSYWQGJrl";
const ROOT = process.cwd();
const SKIP_DIRS = ["node_modules", ".next", ".git", "db", "skills", ".zscripts", "examples", "download", "mini-services", ".vercel", "upload", "tool-results"];
const SKIP_FILES = [".env", "owner-settings.json", "dev.log", "server.log", "custom.db", "custom.db-journal", "package-lock.json", "worklog.md", "deploy-vercel.ts", "dev.out.log"];
function walk(dir: string, out: string[] = []): string[] { for (const name of readdirSync(dir)) { if (name.startsWith(".") && dir === ROOT) { if (name === ".gitignore" || name === ".env.example") out.push(join(dir, name)); continue; } if (SKIP_DIRS.includes(name)) continue; const full = join(dir, name); const st = statSync(full); if (st.isDirectory()) walk(full, out); else if (st.isFile()) { if (SKIP_FILES.includes(name) || name.endsWith(".log") || name.endsWith(".db") || name.endsWith(".db-journal")) continue; out.push(full); } } return out; }
const files = walk(ROOT);
const payload = files.map((f) => { const rel = relative(ROOT, f).replace(/\\/g, "/"); const buf = readFileSync(f); const isBinary = /\.(png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$/i.test(rel); return { file: rel, data: isBinary ? buf.toString("base64") : buf.toString("utf8"), encoding: isBinary ? "base64" : "utf-8" }; });
const totalSize = payload.reduce((s, f) => s + f.data.length, 0);
console.log(`Uploading ${payload.length} files, ${(totalSize / 1024 / 1024).toFixed(1)}MB...`);
if (totalSize > 9 * 1024 * 1024) {
  console.error("Payload too large! Removing large files...");
  // Sort by size and skip largest until under 9MB
  payload.sort((a, b) => b.data.length - a.data.length);
  while (payload.reduce((s, f) => s + f.data.length, 0) > 9 * 1024 * 1024 && payload.length > 50) {
    const removed = payload.shift();
    console.log(`  Skipped: ${removed.file} (${(removed.data.length / 1024).toFixed(0)}KB)`);
  }
  console.log(`After trimming: ${payload.length} files, ${(payload.reduce((s, f) => s + f.data.length, 0) / 1024 / 1024).toFixed(1)}MB`);
}
const body = JSON.stringify({ name: "sarada-netralaya", project: PROJECT, target: "production", files: payload, projectSettings: { framework: "nextjs", buildCommand: null, installCommand: null, outputDirectory: ".next" } });
const res = await fetch(`https://api.vercel.com/v13/deployments?teamId=${TEAM}`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }, body });
const data: any = await res.json();
console.log(`HTTP ${res.status}`); if (data.id) console.log(`Deployment ID: ${data.id}`); else console.error("ERROR:", JSON.stringify(data).slice(0, 800));
