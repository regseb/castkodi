import assert from "assert";
import { extractVideo, extractEmbed }
                                   from "../../../../src/core/scraper/vimeo.js";

describe("core/scraper/vimeo.js", function () {
    describe("extractVideo()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://developer.vimeo.com/";

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://vimeo.com/channels";

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = "https://vimeo.com/228786490";

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=228786490");
        });

        it("should return video id when protocol is HTTP", async function () {
            const url = "http://vimeo.com/228786490";

            const file = await extractVideo(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=228786490");
        });
    });

    describe("extractEmbed()", function () {
        it("should return null when it's not a video", async function () {
            const url = "https://player.vimeo.com/video/foobar";

            const file = await extractEmbed(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = "https://player.vimeo.com/video/228786490";

            const file = await extractEmbed(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=228786490");
        });
    });
});
