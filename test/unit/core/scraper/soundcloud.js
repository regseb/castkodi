import assert      from "assert";
import { extract } from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://developers.soundcloud.com/";

            const file = await extract(new URL(url));
            assert.strictEqual(file, null);
        });

        it("should return audio url", async function () {
            const url = "https://soundcloud.com/foo/bar";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.audio.soundcloud/play/" +
                               "?url=https%3A%2F%2Fsoundcloud.com%2Ffoo%2Fbar");
        });

        it("should return audio url from mobile version", async function () {
            const url = "https://mobi.soundcloud.com/foo";

            const file = await extract(new URL(url));
            assert.strictEqual(file,
                "plugin://plugin.audio.soundcloud/play/" +
                                "?url=https%3A%2F%2Fmobi.soundcloud.com%2Ffoo");
        });
    });
});
