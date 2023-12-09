/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/flickr.js";

describe("core/scraper/flickr.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.flickr.com/explore");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({}));

            const url = new URL("https://www.flickr.com/photos/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:image"
                                     content="https://live.staticflickr.com` +
                                `/bar/baz_qux_b.jpg">
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://api.flickr.com/services/rest" +
                    "?method=flickr.video.getStreamInfo&format=json" +
                    "&nojsoncallback=1&photo_id=baz&secret=qux" +
                    "&api_key=quux",
            ]);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    streams: {
                        stream: [{ _content: "https://foo.com/bar.mp4" }],
                    },
                }),
            );

            const url = new URL("https://www.flickr.com/photos/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><head>
                               <meta property="og:image"
                                     content="https://live.staticflickr.com` +
                                `/qux/quux_corge_b.jpg">
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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://api.flickr.com/services/rest" +
                    "?method=flickr.video.getStreamInfo&format=json" +
                    "&nojsoncallback=1&photo_id=quux&secret=corge" +
                    "&api_key=grault",
            ]);
        });
    });
});
