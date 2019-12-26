import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: SoundCloud", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://soundcloud.com/a-tribe-called-red/sets" +
                                                                 "/trapline-ep";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not an audio with one slash",
                                                             async function () {
        const url = "https://soundcloud.com/you/collection";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id", async function () {
        const url = "https://soundcloud.com/esa/a-singing-comet";
        const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id when protocol is HTTP", async function () {
        const url = "http://soundcloud.com/esa/a-singing-comet";
        const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?track_id=176387011";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id from mobile version", async function () {
        const url = "https://mobi.soundcloud.com/a-tribe-called-red" +
                                                       "/electric-pow-wow-drum";
        const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                            "?track_id=8481452";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
