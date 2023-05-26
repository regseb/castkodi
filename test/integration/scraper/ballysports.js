/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Bally Sports", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.ballysports.com/watch/vod/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.ballysports.com/watch/vod" +
                "/hunter-greene-has-made-a-habit-of-giving-back-to-kids",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://vod-i-01-ballysports.akamaized.net/Content/HLSv3/VOD" +
                "/10943/8939/2f712042-9bc6-4b28-9abc-0ef2ebf92750" +
                "/95a063a6-2e7a-8419-4854-28fe929ec7c4/index.m3u8",
        );
    });
});
