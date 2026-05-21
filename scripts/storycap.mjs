// Runs storycap against a freshly booted Storybook dev server.
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

// Capture against the static build, not `storybook dev`: the dev server's
// client-side redirect to `/?path=...` destroys Puppeteer's execution context
// while storycap enumerates stories (storycap v4 + Storybook 7 incompat).
const args = [
	"--serverCmd",
	"http-server storybook-static -p 6006 -s -c-1",
	"http://localhost:6006",
	"--serverTimeout",
	"120000",
	"--chromiumPath",
	chromiumPath,
	...process.argv.slice(2)
];

const child = spawn("storycap", args, { stdio: "inherit", shell: false });
child.on("exit", (code) => process.exit(code ?? 1));
