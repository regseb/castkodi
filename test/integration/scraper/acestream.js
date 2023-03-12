/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ace Stream", function () {
    it("should return video URL", async function () {
        const url = new URL(
            "acestream://94c2fd8fb9bc8f2fc71a2cbe9d4b866f227a0209",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://program.plexus/?mode=1&name=&url=acestream%3A%2F%2F94c2" +
                "fd8fb9bc8f2fc71a2cbe9d4b866f227a0209",
        );
    });
});
