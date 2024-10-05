/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Viously", function () {
    it("should return video URL from export", async function () {
        const url = new URL(
            "https://www.viously.com/export/doDeMzbVkpr?wmode=transparent",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.viously.com/video/hls/doDeMzbVkpr/index.m3u8",
        );
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.viously.com/export/doDeMzbVkpr?wmode=transparent",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.viously.com/video/hls/doDeMzbVkpr/index.m3u8",
        );
    });

    it("should return video URL from amp", async function () {
        const url = new URL("https://www.viously.com/amp/3ZSdTrtt4G5");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.viously.com/video/hls/3ZSdTrtt4G5/index.m3u8",
        );
    });
});
