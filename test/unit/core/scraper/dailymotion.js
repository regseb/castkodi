import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/dailymotion.js";

describe("core/scraper/dailymotion.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("http://www.dailymotion.com/fr/feed");

            const file = await scraper.extractVideo(url);
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = new URL("https://www.dailymotion.com/video/foo");

            const file = await scraper.extractVideo(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                     "?mode=playVideo&url=foo");
        });
    });

    describe("extractMinify()", function () {
        it("should return tiny video id", async function () {
            const url = new URL("http://dai.ly/foo");

            const file = await scraper.extractMinify(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                     "?mode=playVideo&url=foo");
        });
    });

    describe("extractEmbed()", function () {
        it("should return embed video id", async function () {
            const url = new URL("https://www.dailymotion.com/embed/video/foo");

            const file = await scraper.extractEmbed(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                     "?mode=playVideo&url=foo");
        });
    });
});
