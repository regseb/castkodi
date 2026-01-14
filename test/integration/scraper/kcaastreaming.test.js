/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: KCAA Radio", () => {
    it("should return audio URL", async () => {
        const url = new URL("https://live.kcaastreaming.com/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://stream.kcaastreaming.com/kcaa.mp3");
    });
});
