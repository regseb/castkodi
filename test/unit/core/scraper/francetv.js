import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/francetv.js";

describe("core/scraper/francetv.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.francetelevisions.fr/et-vous/programme-tv";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.france.tv/foo";
            const content = {
                html: () => Promise.resolve(new DOMParser().parseFromString(`
                    <html>
                      <body>
                        <script></script>
                      </body>
                    </html>`, "text/html")),
            };

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                JSON.stringify({
                    // eslint-disable-next-line camelcase
                    streamroot: { content_id: "https://bar.fr/baz.mp4" },
                }),
            ));

            const url = "https://www.france.tv/foo";
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

            const file = await extract(new URL(url), content);
            assert.strictEqual(file, "https://bar.fr/baz.mp4");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://player.webservices.francetelevisions.fr/v1/videos" +
                "/123-abc?device_type=desktop&browser=firefox",
            ]);

            stub.restore();
        });
    });
});
