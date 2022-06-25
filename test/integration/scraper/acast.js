import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Acast", function () {
    it("should return audio URL [opengraph]", async function () {
        const url = new URL("https://shows.acast.com/cdanslair/episodes" +
                            "/chine-le-virus-qui-inquiete-le-monde-22-01-2020");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://open.acast.com/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                               "/5e288874bd860fd53f96625f.mp3");
    });

    it("should return audio URL from embed", async function () {
        const url = new URL("https://embed.acast.com/5b7ac427c6a58e726f576cff" +
                                        "/626c0242162abf00141b401b?logo=false");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://sphinx.acast.com/p/open/s/5b7ac427c6a58e726f576cff/e" +
                                         "/626c0242162abf00141b401b/media.mp3");
    });
});
