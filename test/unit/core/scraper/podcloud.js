import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/podcloud.js";

describe("core/scraper/podcloud.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://podcloud.fr/podcast/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://podcloud.fr/podcast/foo/episode/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "https://podcloud.fr/ext/foo/bar/enclosure.mp3");
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = new URL("http://podcloud.fr/podcast/foo/episode/bar");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "https://podcloud.fr/ext/foo/bar/enclosure.mp3");
        });
    });
});
