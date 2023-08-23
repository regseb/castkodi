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
            const url = new URL("https://www.flickr.com/photos/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            "<html><body></body></html>",
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    streams: {
                        stream: [{ _content: "https://foo.net/bar.mp4" }],
                    },
                }),
            );

            const url = new URL("https://www.flickr.com/photos/baz");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html><body>
                               <script>
                                 root.YUI_config.flickr.api.site_key = "qux";
                               </script>
                               <video poster="//quux.com/corge` +
                                `/grault_garply.jpg" />
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extract(url, metadata);
            assert.equal(file, "https://foo.net/bar.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://api.flickr.com/services/rest" +
                    "?method=flickr.video.getStreamInfo&format=json" +
                    "&nojsoncallback=1&photo_id=grault&secret=garply" +
                    "&api_key=qux",
            ]);
        });
    });
});
