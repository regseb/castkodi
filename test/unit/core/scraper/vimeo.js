import assert from "assert";
import { extractEmbed, extractVideo }
                                   from "../../../../src/core/scraper/vimeo.js";

describe("core/scraper/vimeo.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://developer.vimeo.com/");

            const file = await extractVideo(url);
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = new URL("https://vimeo.com/channels");

            const file = await extractVideo(url);
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = new URL("https://vimeo.com/12345");

            const file = await extractVideo(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=12345");
        });

        it("should return video id when protocol is HTTP", async function () {
            const url = new URL("http://vimeo.com/12345");

            const file = await extractVideo(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=12345");
        });
    });

    describe("extractEmbed()", function () {
        it("should return null when it's not a video", async function () {
            const url = new URL("https://player.vimeo.com/video/foo");

            const file = await extractEmbed(url);
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = new URL("https://player.vimeo.com/video/12345");

            const file = await extractEmbed(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=12345");
        });
    });
});
