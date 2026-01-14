/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/aparat.js";
import "../../setup.js";

describe("core/scraper/aparat.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.aparat.com/result/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
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
