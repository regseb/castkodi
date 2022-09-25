import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Acast", function () {
    it("should return audio URL [opengraph]", async function () {
        const url = new URL("https://play.acast.com/s/c-dans-lair" +
                                       "/8caa8723-c9fd-4104-97f9-5da3d44f2d0b");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://francetv.proxycast.org/2969354392962084864" +
                                   "/8caa8723-c9fd-4104-97f9-5da3d44f2d0b.mp3" +
                                                  "?u=VePZcdrLSG&_=1661879526");
    });

    it("should return audio URL from share [opengraph]", async function () {
        const url = new URL("https://play.acast.com/s" +
                                                   "/5d84d37cf721f89940031fb4" +
                                                   "/63282b9b00922400136f2602");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://sphinx.acast.com/p/open/s/5d84d37cf721f89940031fb4/e" +
                                         "/63282b9b00922400136f2602/media.mp3");
    });

    it("should return audio URL from embed", async function () {
        const url = new URL("https://embed.acast.com/5b7ac427c6a58e726f576cff" +
                                           "/626c0242162abf00141b401b?seek=42");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://sphinx.acast.com/p/open/s/5b7ac427c6a58e726f576cff/e" +
                                         "/626c0242162abf00141b401b/media.mp3");
    });
});
