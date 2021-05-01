import assert from "node:assert";
import { extract } from "../../../../src/core/scraper/dumpert.js";

describe("core/scraper/dumpert.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("http://www.dumpert.nl/toppers/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.dumpert.nl/mediabase/7248279" +
                                                "/47066e59/wheelie_in_ny.html");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dumpert/?action=play" +
                                "&video_page_url=https%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                       "%2Fwheelie_in_ny.html");
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = new URL("http://www.dumpert.nl/mediabase/7248279" +
                                                "/47066e59/wheelie_in_ny.html");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dumpert/?action=play" +
                                 "&video_page_url=http%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                       "%2Fwheelie_in_ny.html");
        });
    });
});
