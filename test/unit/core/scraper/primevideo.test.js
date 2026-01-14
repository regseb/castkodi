/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/primevideo.js";
import "../../setup.js";

describe("core/scraper/primevideo.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.primevideo.com/storefront/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
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

        it("should return video id", async () => {
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
