import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/francetv.js";

describe("core/scraper/francetv.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.francetelevisions.fr/et-vous" +
                                                               "/programme-tv");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://www.france.tv/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").callsFake((url) => {
                const json = url.startsWith("https://player.webservices.")
                                       ? { video: { token: "https://bar.fr/" } }
                                       : { url: "https://baz.fr/qux.mpd" };
                return Promise.resolve(new Response(JSON.stringify(json)));
            });

            const url = new URL("https://www.france.tv/foo");
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script>
                          var FTVPlayerVideos = [{
                              "contentId":1143295,
                              "videoId":"123-abc"
                          }];
                        </script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(url, content);
            assert.strictEqual(file, "https://baz.fr/qux.mpd");

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://player.webservices.francetelevisions.fr/v1/videos" +
                "/123-abc?device_type=desktop&browser=firefox",
            ]);
            assert.deepStrictEqual(stub.secondCall.args, ["https://bar.fr/"]);

            stub.restore();
        });
    });
});
