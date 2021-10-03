import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/dumpert.js";

describe("core/scraper/dumpert.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("http://www.dumpert.nl/toppers/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.dumpert.nl/mediabase/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dumpert/" +
                    "?action=play&video_page_url=https%3A%2F%2Fwww.dumpert.nl" +
                                                          "%2Fmediabase%2Ffoo");
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = new URL("http://www.dumpert.nl/mediabase/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.dumpert/" +
                     "?action=play&video_page_url=http%3A%2F%2Fwww.dumpert.nl" +
                                                          "%2Fmediabase%2Ffoo");
        });
    });
});
