/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: GoPlay", function () {
    it("should return URL when it isn't a video", async function () {
        const url = new URL("https://www.goplay.be/programmas");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.goplay.be/video/katje-with-the-stars" +
                "/teleurgesteld-en-fier-yemi-en-laura-moeten-dancing-with-the" +
                "-stars-verlaten",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://stream1-vod.cdn1.sbs.prd.telenet-ops.be/geo" +
                "/KATJE_WITH_THE_STARS" +
                "/3d908993fd870e73eeaadeb4c220ca4c14bf7387/KWTS_YEMI" +
                "/KWTS_YEMI.m3u8",
        );
    });
});
