import assert      from "assert";
import { extract } from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://developers.soundcloud.com/";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio url", async function () {
            const url = "https://soundcloud.com/foo/bar";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio url from mobile version", async function () {
            const url = "https://mobi.soundcloud.com/foo";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                 "?url=https%3A%2F%2Fmobi.soundcloud.com%2Ffoo";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
