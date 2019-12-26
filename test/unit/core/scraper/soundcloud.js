import assert      from "assert";
import { extract } from "../../../../src/core/scraper/soundcloud.js";

describe("core/scraper/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://soundcloud.com/stream";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://soundcloud.com/a-tribe-called-red" +
                                                            "/sets/trapline-ep";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio with one slash",
                                                             async function () {
            const url = "https://soundcloud.com/you/collection";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id", async function () {
            const url = "https://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id when protocol is HTTP", async function () {
            const url = "http://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio id from mobile version", async function () {
            const url = "https://mobi.soundcloud.com" +
                                    "/a-tribe-called-red/electric-pow-wow-drum";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                            "?track_id=8481452";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
