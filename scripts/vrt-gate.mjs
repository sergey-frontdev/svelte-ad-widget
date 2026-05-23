// Fails the build when the visual regression run found differences.
//
// `reg-suit run` always exits 0, even when screenshots diverge — it expects a
// human to review the report. We still want a failing check that blocks merge,
// so this reads the comparison result and exits non-zero on any non-passing
// item. It runs *after* the report upload step, so the artifact is always
// available for review even when this gate fails.
import { readFileSync } from "node:fs";

const out = JSON.parse(readFileSync(".reg/out.json", "utf8"));

const { failedItems = [], newItems = [], deletedItems = [] } = out;
const problems = failedItems.length + newItems.length + deletedItems.length;

if (problems === 0) {
	console.log("Visual regression passed: no differences.");
	process.exit(0);
}

const list = (label, items) => items.length && console.error(`${label} (${items.length}):\n  ${items.join("\n  ")}`);
console.error(`Visual regression failed: ${problems} item(s) need review.`);
list("Changed", failedItems);
list("New (no baseline)", newItems);
list("Deleted (baseline removed)", deletedItems);
console.error("\nReview the uploaded vrt-report artifact, then run `npm run vrt:approve` to update the baseline.");
process.exit(1);
