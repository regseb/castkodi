import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: آپارات (Aparat)", function () {
    it("should return show URL", async function () {
        const url = new URL("https://www.aparat.com/v/IWTPf");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://www.aparat.com/video/hls/manifest/videohash/IWTPf/f" +
                                                                 "/IWTPf.m3u8");
    });
});
