import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/ardmediathek.js";

describe("core/scraper/ardmediathek.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.ard.de/");

            const file = await scraper.extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL", async function () {
            const url = new URL("https://www.ardmediathek.de/video/foo/bar" +
                                                                   "/baz/qux/");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.ardmediathek_de/?client=ard" +
                                                     "&mode=libArdPlay&id=qux");
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = new URL("http://www.ardmediathek.de/video/foo/bar" +
                                                                   "/baz/qux/");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.ardmediathek_de/" +
                                          "?client=ard&mode=libArdPlay&id=qux");
        });
    });
});
