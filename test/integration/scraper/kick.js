/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Kick", function () {
    it("should return undefined with home page", async function () {
        const url = new URL("https://kick.com/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined with legal page", async function () {
        const url = new URL("https://kick.com/dmca-policy");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined when it isn't a live", async function () {
        const url = new URL("https://kick.com/categories");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });
});
