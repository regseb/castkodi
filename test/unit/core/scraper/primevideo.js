/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/primevideo.js";

describe("core/scraper/primevideo.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.primevideo.com/storefront/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://www.primevideo.com/detail/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const url = new URL("https://www.primevideo.com/detail/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div id="a-page">
                                 <script type="text/template">${JSON.stringify({
                                     props: {
                                         body: [
                                             {
                                                 args: { titleID: "bar" },
                                                 props: {
                                                     atf: {
                                                         state: {
                                                             detail: {
                                                                 headerDetail: {
                                                                     bar: {
                                                                         catalogId:
                                                                             "baz",
                                                                         title: "Qux",
                                                                     },
                                                                 },
                                                             },
                                                         },
                                                     },
                                                 },
                                             },
                                         ],
                                     },
                                 })}</script>
                               </div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(
                file,
                "plugin://plugin.video.amazon-test/" +
                    "?mode=PlayVideo&asin=baz&name=Qux",
            );
        });
    });
});
