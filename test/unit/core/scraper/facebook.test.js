/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/facebook.js";

describe("core/scraper/facebook.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.facebook.com/marketplace/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const html = mock.fn(() =>
                Promise.resolve(
                    new DOMParser().parseFromString(
                        `<html lang="en"><body>
                           <script type="application/json" data-sjs>{}</script>
                         </body></html>`,
                        "text/html",
                    ),
                ),
            );

            const url = new URL("https://www.facebook.com/watch/foo");
            const metadata = { html };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(html.mock.callCount(), 1);
            assert.deepEqual(html.mock.calls[0].arguments, [
                { headers: { Accept: "text/html" } },
            ]);
        });

        it("should return video HD URL", async function () {
            const html = mock.fn(() =>
                Promise.resolve(
                    new DOMParser().parseFromString(
                        `<html lang="en"><body>
                           <script type="application/json" data-sjs>{}</script>
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
            );

            const url = new URL("https://www.facebook.com/watch/foo");
            const metadata = { html };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://bar.com/baz.mp4");

            assert.equal(html.mock.callCount(), 1);
            assert.deepEqual(html.mock.calls[0].arguments, [
                { headers: { Accept: "text/html" } },
            ]);
        });

        it("should return video SD URL", async function () {
            const html = mock.fn(() =>
                Promise.resolve(
                    new DOMParser().parseFromString(
                        `<html lang="en"><body>
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
            );

            const url = new URL("https://www.facebook.com/foo/videos/bar");
            const metadata = { html };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://baz.com/qux.mp4");

            assert.equal(html.mock.callCount(), 1);
            assert.deepEqual(html.mock.calls[0].arguments, [
                { headers: { Accept: "text/html" } },
            ]);
        });
    });
});
