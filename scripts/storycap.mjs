// Runs storycap against an already-running Storybook server (booted alongside
// this process via `concurrently` — see the `vrt:capture` npm script).
//
// storycap v4 ships an old puppeteer-core that can't consume puppeteer 25's
// async `executablePath()`, so its `--chromiumChannel puppeteer` path is
// broken. We resolve the pinned Chromium ourselves and pass it explicitly via
// `--chromiumPath`, which keeps screenshots reproducible across machines.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer");

const chromiumPath = await puppeteer.executablePath();

// Capture against the static build served on :6006, not `storybook dev`: the
// dev server's client-side redirect to `/?path=...` destroys Puppeteer's
// execution context while storycap enumerates stories (storycap v4 +
// Storybook 7 incompat). The server is started separately; `wait-on` in the
// npm script guarantees it's reachable before we get here.
const args = ["http://localhost:6006", "--chromiumPath", chromiumPath, ...process.argv.slice(2)];

const child = spawn("storycap", args);
child.on("exit", (code) => process.exit(code ?? 1));
