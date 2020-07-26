import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/flickr.js";

describe("core/scraper/flickr.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.flickr.com/explore");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.flickr.com/photos/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body></body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    streams: {
                        stream: [{ _content: "https://baz.net/qux.mp4" }],
                    },
                }),
            ));

            const url = new URL("https://www.flickr.com/photos/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                            root.YUI_config.flickr.api.site_key = "bar";
                        </script>
                        <video poster="0/1_2.3.4_5/6/7_8.9" />
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://baz.net/qux.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://api.flickr.com/services/rest" +
                "?method=flickr.video.getStreamInfo&format=json" +
                "&nojsoncallback=1&photo_id=6&secret=7&api_key=bar",
            ]);

            stub.restore();
        });
    });
});
