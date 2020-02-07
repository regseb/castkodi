import assert      from "assert";
import sinon       from "sinon";
import { extract } from "../../../../src/core/scraper/francetv.js";

describe("core/scraper/francetv.js", function () {
    afterEach(function () {
        sinon.restore();
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://www.francetelevisions.fr/et-vous/programme-tv";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.france.tv/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <script></script>
                  </body>
                </html>`, "text/html");
            const expected = null;

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            sinon.stub(globalThis, "fetch")
                 .callsFake(() => Promise.resolve({
                "json": () => ({
                    "streamroot": { "content_id": "https://bar.fr/baz.mp4" }
                })
            }));

            const url = "https://www.france.tv/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <script>
                      var FTVPlayerVideos = [{
                          "contentId":1143295,
                          "videoId":"123-abc"
                      }];
                    </script>
                  </body>
                </html>`, "text/html");
            const expected = "https://bar.fr/baz.mp4";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
            const call = globalThis.fetch.firstCall;
            assert.strictEqual(call.args[0],
                               "https://player.webservices.francetelevisions" +
                               ".fr/v1/videos/123-abc?device_type=desktop" +
                               "&browser=firefox");
        });
    });
});
