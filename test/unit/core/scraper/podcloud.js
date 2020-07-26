import assert      from "assert";
import { extract } from "../../../../src/core/scraper/podcloud.js";

describe("core/scraper/podcloud.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://podcloud.fr/podcast/foo");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return audio URL", async function () {
            const url = new URL("https://podcloud.fr/podcast/foo/episode/bar");

            const file = await extract(url);
            assert.strictEqual(file,
                "https://podcloud.fr/ext/foo/bar/enclosure.mp3");
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = new URL("http://podcloud.fr/podcast/foo/episode/bar");

            const file = await extract(url);
            assert.strictEqual(file,
                "https://podcloud.fr/ext/foo/bar/enclosure.mp3");
        });
    });
});
