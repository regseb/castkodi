/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/flickr.js";
import "../../setup.js";

describe("core/scraper/flickr.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.flickr.com/explore");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({})),
            );

            const url = new URL("https://www.flickr.com/photos/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta
                                 property="og:image"
                                 content="https://live.staticflickr.com/bar/baz_qux_b.jpg"
                               >
                             </head><body>
                               <script>
                                 root.YUI_config.flickr.api.site_key = "quux";
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.flickr.com/services/rest" +
                    "?method=flickr.video.getStreamInfo&format=json" +
                    "&nojsoncallback=1&photo_id=baz&secret=qux&api_key=quux",
            ]);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        streams: {
                            stream: [{ _content: "https://foo.com/bar.mp4" }],
                        },
                    }),
                ),
            );

            const url = new URL("https://www.flickr.com/photos/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><head>
                               <meta
                                 property="og:image"
                                 content="https://live.staticflickr.com/qux/quux_corge_b.jpg"
                               >
                             </head><body>
                               <script>
                                 root.YUI_config.flickr.api.site_key = "grault";
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.com/bar.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.flickr.com/services/rest" +
                    "?method=flickr.video.getStreamInfo&format=json" +
                    "&nojsoncallback=1&photo_id=quux&secret=corge" +
                    "&api_key=grault",
            ]);
        });
    });
});
