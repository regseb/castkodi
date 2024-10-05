/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/aparat.js";

describe("core/scraper/aparat.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.aparat.com/result/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.aparat.com/v/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "https://www.aparat.com/video/hls/manifest/videohash/foo/f" +
                    "/foo.m3u8",
            );
        });
    });
});
