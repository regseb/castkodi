/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/vidlox.js";

describe("core/scraper/vidlox.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://twitter.com/vidloxtv");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://vidlox.me/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://vidlox.me/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>
                                 var player = new Clappr.Player({
                                   sources: ["https://bar.baz/qux.m3u8","QUUX"]
                                 })
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://bar.baz/qux.m3u8");
        });
    });
});
