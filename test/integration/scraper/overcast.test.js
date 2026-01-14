/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Overcast", () => {
    it("should return audio URL [audio]", async () => {
        const url = new URL("https://overcast.fm/+JUKOBdbAM");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp3"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
