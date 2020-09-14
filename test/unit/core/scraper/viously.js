import assert      from "assert";
import { extract } from "../../../../src/core/scraper/viously.js";

describe("core/scraper/viously.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://www.viously.com/");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video URL from export", async function () {
            const url = new URL("https://www.viously.com/export/foo?bar=baz");

            const file = await extract(url);
            assert.strictEqual(file, "https://v.kolplay.com/foo/index.m3u8");
        });

        it("should return video URL from amp", async function () {
            const url = new URL("https://www.viously.com/amp/foo");

            const file = await extract(url);
            assert.strictEqual(file, "https://v.kolplay.com/foo/index.m3u8");
        });
    });
});
