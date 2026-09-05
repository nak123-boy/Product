import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const isWindows = process.platform === "win32";

function run(command, args, name) {
  console.log(`\n========================================`);
  console.log(` STARTING ${name}`);
  console.log(`========================================\n`);

  const child = spawn(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
    windowsHide: false,
  });

  child.on("error", (err) => {
    console.error(`\n[${name}] ERROR:`, err.message);
  });

  child.on("exit", (code, signal) => {
    console.log(
      `\n[${name}] stopped. code=${code} signal=${signal || "none"}`
    );
  });

  return child;
}


/* =========================================================
   CHECK PROJECT
========================================================= */

if (!existsSync(resolve(ROOT, "package.json"))) {
  console.error("\nERROR: package.json not found.");
  console.error("Please run npm run dev inside the project folder.\n");
  process.exit(1);
}

if (!existsSync(resolve(ROOT, "backend", "main.py"))) {
  console.error("\nERROR: backend/main.py not found.\n");
  process.exit(1);
}


/* =========================================================
   WINDOWS
========================================================= */

let backend;
let frontend;

if (isWindows) {

  /*
   * Backend
   * python -m uvicorn backend.main:app
   */
  backend = run(
    "cmd.exe",
    [
      "/d",
      "/s",
      "/c",
      "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000",
    ],
    "FASTAPI BACKEND"
  );


  /*
   * Frontend
   * npm exec vite -- --host localhost --port 5173
   */
  frontend = run(
    "cmd.exe",
    [
      "/d",
      "/s",
      "/c",
      "npm exec vite -- --host localhost --port 5173",
    ],
    "VITE FRONTEND"
  );

} else {

  backend = run(
    "python3",
    [
      "-m",
      "uvicorn",
      "backend.main:app",
      "--host",
      "127.0.0.1",
      "--port",
      "8000",
    ],
    "FASTAPI BACKEND"
  );


  frontend = run(
    "npx",
    [
      "vite",
      "--host",
      "localhost",
      "--port",
      "5173",
    ],
    "VITE FRONTEND"
  );
}


/* =========================================================
   KEEP BOTH SERVERS RUNNING
========================================================= */

function shutdown() {

  console.log("\nStopping KH FASHION servers...\n");

  if (backend && !backend.killed) {
    backend.kill();
  }

  if (frontend && !frontend.killed) {
    frontend.kill();
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`
==================================================
              KH FASHION
==================================================

Frontend:
http://localhost:5173/

Backend:
http://127.0.0.1:8000/

Products:
http://127.0.0.1:8000/api/products

API Docs:
http://127.0.0.1:8000/docs

==================================================
DO NOT CLOSE THIS TERMINAL
==================================================
`);