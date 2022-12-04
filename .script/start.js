/**
 * @module
 */

import fs from "node:fs/promises";
import webExt from "web-ext";

const TARGETS = {
    chromium: "chromium",
    firefox:  "firefox-desktop",
};

const SOURCE_DIR = "src";

const browser = process.argv[2];

await fs.cp(`src/manifest-${browser}.json`, "src/manifest.json");

await webExt.cmd.run({
    target:    TARGETS[browser],
    sourceDir: SOURCE_DIR,
});
