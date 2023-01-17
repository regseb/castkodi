import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/flickr.js";

describe("core/scraper/flickr.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.flickr.com/explore");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's not a video", async function () {
            const url = new URL("https://www.flickr.com/photos/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
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
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            root.YUI_config.flickr.api.site_key = "qux";
                        </script>
                        <video poster="0/1_2.3.4_5/6/7_8.9" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await scraper.extract(url, content);
            assert.equal(file, "https://foo.net/bar.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://api.flickr.com/services/rest" +
                    "?method=flickr.video.getStreamInfo&format=json" +
                    "&nojsoncallback=1&photo_id=6&secret=7&api_key=qux",
            ]);
        });
    });
});
