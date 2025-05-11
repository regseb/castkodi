/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/gamekult.js";

describe("core/scraper/gamekult.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.gameblog.fr/");
            const metadata = undefined;
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's depth", async function () {
            const url = new URL("https://www.gamekult.com/foo");
            const metadata = undefined;
            const context = { depth: true, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.gamekult.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.gamekult.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <div class="vsly-plyr" id="vsly-plyr-bar"></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };
            const context = { depth: false, incognito: false };

            const file = await scraper.extract(url, metadata, context);
            assert.equal(
                file,
                "https://www.viously.com/video/hls/bar/index.m3u8",
            );
        });
    });
});
