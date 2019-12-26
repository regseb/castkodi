import assert      from "assert";
import { extract } from "../../../../src/core/scraper/gamekult.js";

describe("core/scraper/gamekult.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "http://www.gameblog.fr/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.gamekult.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body></body>
                </html>`, "text/html");
            const expected = null;

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.gamekult.com/foo";
            const doc = new DOMParser().parseFromString(`
                <html>
                  <body>
                    <div class="js-dailymotion-video" data-id="bar"></div>
                  </body>
                </html>`, "text/html");
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                      "?mode=playVideo&url=bar";

            const file = await extract(new URL(url), doc);
            assert.strictEqual(file, expected);
        });
    });
});
