import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/flickr.js";

describe("core/scraper/flickr.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            // Appeler les URLs non-sécurisées car l'entête HTTP de la version
            // sécurisé de Flickr est trop grosse pour Node.
            const url = "http://www.flickr.com/explore";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "http://www.flickr.com/photos/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body></body>
                </html>`, "text/html");
            const expected = null;

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                json: () => ({
                    streams: {
                        stream: [{ _content: "https://baz.net/qux.mp4" }],
                    },
                }),
            }));

            const url = "http://www.flickr.com/photos/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <script>
                        root.YUI_config.flickr.api.site_key = "bar";
                    </script>
                    <video poster="0/1_2.3.4_5/6/7_8.9" />
                  </body>
                </html>`, "text/html");
            const expected = "https://baz.net/qux.mp4";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://api.flickr.com/services/rest" +
                               "?method=flickr.video.getStreamInfo" +
                               "&format=json&nojsoncallback=1&photo_id=6" +
                               "&secret=7&api_key=bar");
        });
    });
});
