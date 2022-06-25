import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Pippa", function () {
    it("should return URL when it's not an audio", async function () {
        const url = new URL("https://shows.pippa.io/studio-404/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return audio URL [opengraph]", async function () {
        const url = new URL("https://shows.pippa.io/cdanslair/episodes" +
                               "/5-decembre-la-greve-qui-fait-peur-22-11-2019");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://open.acast.com/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                               "/5dd81469bd860fd53f965cf7.mp3");
    });

    it("should return audio URL when protocol is HTTP [opengraph]",
                                                             async function () {
        const url = new URL("http://shows.pippa.io/cdanslair/episodes" +
                           "/hongkong-la-colere-monte-pekin-menace-19-11-2019");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://open.acast.com/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                               "/5dd4250950a8cbb62f4b21ad.mp3");
    });
});
