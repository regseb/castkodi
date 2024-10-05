/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/facebook.js";

describe("core/scraper/facebook.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.facebook.com/marketplace/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.facebook.com/watch/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script type="application/json"
                                       data-sjs>{}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video HD URL", async function () {
            const url = new URL("https://www.facebook.com/watch/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script type="application/json"
                                       data-sjs>{}</script>
                               <script type="application/json"
                                       data-sjs>${JSON.stringify({
                                           // eslint-disable-next-line camelcase
                                           browser_native_hd_url:
                                               "https://bar.com/baz.mp4",
                                           // eslint-disable-next-line camelcase
                                           browser_native_sd_url:
                                               "https://qux.com/quux.mp4",
                                       })}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://bar.com/baz.mp4");
        });

        it("should return video SD URL", async function () {
            const url = new URL("https://www.facebook.com/foo/videos/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script type="application/json"
                                       data-sjs>${JSON.stringify({
                                           // eslint-disable-next-line camelcase
                                           browser_native_sd_url:
                                               "https://baz.com/qux.mp4",
                                       })}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.mp4");
        });
    });
});
