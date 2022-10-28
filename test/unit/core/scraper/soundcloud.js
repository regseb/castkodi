import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://developers.soundcloud.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio url", async function () {
            const url = new URL("https://soundcloud.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar");
        });

        it("should return audio url from mobile version", async function () {
            const url = new URL("https://mobi.soundcloud.com/foo");

            const file = await scraper.extract(url);
            assert.equal(file,
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fmobi.soundcloud.com%2Ffoo");
        });
    });
});
