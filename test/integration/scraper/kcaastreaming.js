/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: KCAA Radio", function () {
    it("should return audio URL", async function () {
        const url = new URL("https://live.kcaastreaming.com/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://stream.kcaastreaming.com/kcaa.mp3");
    });
});
