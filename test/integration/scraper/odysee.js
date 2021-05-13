import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Odysee", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://odysee.com/$/signin");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://odysee.com/@informatique:4" +
                                                         "/Mediacenter-KODI:9");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://odysee.com/$/stream/Mediacenter-KODI" +
                                   "/95a3a486dcb31771ea4b43a1a2baed1e5bf3949f");
    });
});
