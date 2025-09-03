/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Acast", function () {
    it("should return audio URL", async function () {
        const url = new URL(
            "https://shows.acast.com/cyber/episodes" +
                "/the-killer-robot-future-is-already-here",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://sphinx.acast.com/p/acast/s/cyber/e" +
                "/635be0917cf2770011533612/media.mp3",
        );
    });

    it("should return audio URL from embed", async function () {
        const url = new URL(
            "https://embed.acast.com/$/5b7ac427c6a58e726f576cff" +
                "/silence-on-joue-the-stanley-parable-ultra-deluxe-tiny" +
                "-tinas-?",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://sphinx.acast.com/p/open/s/5b7ac427c6a58e726f576cff/e" +
                "/626c0242162abf00141b401b/media.mp3",
        );
    });
});
