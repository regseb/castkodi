/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as scraper from "../../../../src/core/scraper/tiktok.js";
import "../../setup.js";

describe("core/scraper/tiktok.js", () => {
    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.tictac.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't data", async () => {
            const url = new URL("https://www.tiktok.com/foo");
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

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://www.tiktok.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">${JSON.stringify(
                                   {
                                       __DEFAULT_SCOPE__: {},
                                   },
                               )}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL("https://www.tiktok.com/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">${JSON.stringify(
                                   {
                                       __DEFAULT_SCOPE__: {
                                           "webapp.video-detail": {
                                               itemInfo: {
                                                   itemStruct: {
                                                       video: {
                                                           playAddr:
                                                               "https://bar.com/baz.mp4",
                                                       },
                                                   },
                                               },
                                           },
                                       },
                                   },
                               )}</script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://bar.com/baz.mp4");
        });
    });
});
