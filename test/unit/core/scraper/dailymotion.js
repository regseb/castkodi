import assert from "assert";
import { extractVideo, extractMinify, extractEmbed }
                             from "../../../../src/core/scraper/dailymotion.js";

describe("core/scraper/dailymotion.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "http://www.dailymotion.com/fr/feed";

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = "https://www.dailymotion.com/video/x17qw0a";

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=x17qw0a");
        });
    });

    describe("extractMinify()", function () {
        it("should return tiny video id", async function () {
            const url = "http://dai.ly/x5riqme";

            const file = await extractMinify(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=x5riqme");
        });
    });

    describe("extractEmbed()", function () {
        it("should return embed video id", async function () {
            const url = "https://www.dailymotion.com/embed/video/a12bc3d";

            const file = await extractEmbed(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=a12bc3d");
        });
    });
});
