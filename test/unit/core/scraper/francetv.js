import assert      from "assert";
import { extract } from "../../../../src/core/scraper/francetv.js";

describe("core/scraper/francetv.js", function () {
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
            const url = "https://www.france.tv/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <script>
                      var FTVPlayerVideos = [{
                          "contentId":1143295,
                          "videoId":"4744326d-6440-48f5-a0ed-68a11113a0b6"
                      }];
                    </script>
                  </body>
                </html>`, "text/html");
            const expected = "https://replayftv-vh.akamaihd.net/i" +
                             "/streaming-adaptatif_france-dom-tom/2020/S03/J2" +
                                                   "/221005052-5e1ed67f8e9fb-" +
                         ",standard1,standard2,standard3,standard4,.mp4.csmil" +
                                                                "/master.m3u8" +
                        "?caption=%2F2020%2F01%2F15%2F221005052-5e1ed67f8e9fb" +
                                           "-1579080386.m3u8%3Afra%3AFrancais" +
                                               "&audiotrack=0%3Afra%3AFrancais";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
