import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Acast", function () {
    it("should return audio URL", async function () {
        const url = new URL("https://play.acast.com/s/cyber" +
                            "/the-killer-robot-future-is-already-here");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://sphinx.acast.com/p/acast/s/cyber/e" +
                "/635be0917cf2770011533612/media.mp3");
    });

    it("should return audio URL from share", async function () {
        const url = new URL("https://play.acast.com/s" +
                            "/5d84d37cf721f89940031fb4" +
                            "/63282b9b00922400136f2602");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://sphinx.acast.com/p/open/s/5d84d37cf721f89940031fb4/e" +
                "/63282b9b00922400136f2602/media.mp3");
    });

    it("should return audio URL from embed", async function () {
        const url = new URL("https://embed.acast.com/5b7ac427c6a58e726f576cff" +
                            "/626c0242162abf00141b401b?seek=42");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://sphinx.acast.com/p/open/s/5b7ac427c6a58e726f576cff/e" +
                "/626c0242162abf00141b401b/media.mp3");
    });
});
