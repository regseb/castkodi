import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: SoundCloud", function () {
    it("should return URL when it's not an audio", async function () {
        const url = new URL("https://developers.soundcloud.com/docs/api/guide");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return audio url", async function () {
        const url = new URL("https://soundcloud.com/a-tribe-called-red" +
                                                      "/electric-pow-wow-drum");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.audio.soundcloud/play/" +
                                           "?url=https%3A%2F%2Fsoundcloud.com" +
                               "%2Fa-tribe-called-red%2Felectric-pow-wow-drum");
    });

    it("should return audio url from mobile version", async function () {
        const url = new URL("https://mobi.soundcloud.com/esa/a-singing-comet");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.audio.soundcloud/play/" +
                                      "?url=https%3A%2F%2Fmobi.soundcloud.com" +
                                                    "%2Fesa%2Fa-singing-comet");
    });
});
