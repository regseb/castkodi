/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: آپارات (Aparat)", function () {
    it("should return show URL", async function () {
        const url = new URL("https://www.aparat.com/v/x37o946");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.aparat.com/video/hls/manifest/videohash/x37o946/f" +
                "/x37o946.m3u8",
        );
    });
});
