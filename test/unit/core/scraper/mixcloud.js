import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/mixcloud.js";

describe("core/scraper/mixcloud.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://www.mixcloud.com/upload/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it's not an audio", async function () {
            const url = new URL("https://www.mixcloud.com/discover/foo/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio id", async function () {
            const url = new URL("https://www.mixcloud.com/foo/bar/");

            const file = await scraper.extract(url);
            assert.equal(file,
                "plugin://plugin.audio.mixcloud/?mode=40&key=%2Ffoo%2Fbar%2F");
        });

        it("should return audio id when protocol is HTTP", async function () {
            const url = new URL("http://www.mixcloud.com/foo/bar/");

            const file = await scraper.extract(url);
            assert.equal(file,
                "plugin://plugin.audio.mixcloud/?mode=40&key=%2Ffoo%2Fbar%2F");
        });
    });
});
