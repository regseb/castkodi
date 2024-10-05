/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: GoPlay [be]", function () {
    before(function () {
        if (undefined !== config.country && "be" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.goplay.be/programmas");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.goplay.be/video/katje-with-the-stars" +
                "/teleurgesteld-en-fier-yemi-en-laura-moeten-dancing-with-the" +
                "-stars-verlaten",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://stream1-vod.cdn1.sbs.prd.telenet-ops.be/geo" +
                "/KATJE_WITH_THE_STARS" +
                "/3d908993fd870e73eeaadeb4c220ca4c14bf7387/KWTS_YEMI" +
                "/KWTS_YEMI.m3u8",
        );
    });
});
