import assert from "node:assert";
import * as scraper from "../../../../src/core/scraper/acast.js";

describe("core/scraper/acast.js", function () {
    describe("extract()", function () {
        it("should return undefined when it's a unsupported URL",
                                                             async function () {
            const url = new URL("https://embed.acast.com/foo");

            const file = await scraper.extract(url);
            assert.strictEqual(file, undefined);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://embed.acast.com/foo/bar?baz=qux");

            const file = await scraper.extract(url);
            assert.strictEqual(file,
                "https://sphinx.acast.com/p/open/s/foo/e/bar/media.mp3");
        });
    });
});
