/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/viously.js";

describe("core/scraper/viously.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.viously.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL from export", async function () {
            const url = new URL("https://www.viously.com/export/foo?bar=baz");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "https://www.viously.com/video/hls/foo/index.m3u8",
            );
        });

        it("should return video URL from amp", async function () {
            const url = new URL("https://www.viously.com/amp/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "https://www.viously.com/video/hls/foo/index.m3u8",
            );
        });
    });
});
