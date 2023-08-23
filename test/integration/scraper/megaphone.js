/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Megaphone", function () {
    it("should return video URL", async function () {
        const url = new URL("https://player.megaphone.fm/SLT2646036872?");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://dcs.megaphone.fm/SLT2646036872.mp3");
    });

    it("should return video URL when protocol is HTTP ", async function () {
        const url = new URL("http://player.megaphone.fm/SLT5236779375");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://dcs.megaphone.fm/SLT5236779375.mp3");
    });

    it("should return video URL from playlist", async function () {
        const url = new URL("https://playlist.megaphone.fm?e=SLT5884670747");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://dcs.megaphone.fm/SLT5884670747.mp3");
    });
});
