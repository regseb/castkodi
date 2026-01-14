/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Streamable", () => {
    it("should return video URL [opengraph]", async () => {
        const url = new URL("https://streamable.com/5kif48");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("5kif48_1.mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
