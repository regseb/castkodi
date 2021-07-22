import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/vimeo.js";

describe("core/scraper/vimeo.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://vimeo.com/channels");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = new URL("https://player.vimeo.com/video/12345");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.vimeo/play/?video_id=12345");
        });
    });
});
