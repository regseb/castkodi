import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Pippa", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://shows.pippa.io/studio-404/";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL", async function () {
        const url = "https://shows.pippa.io/cdanslair/episodes" +
                                "/5-decembre-la-greve-qui-fait-peur-22-11-2019";
        const options = { depth: 0, incognito: false };
        const expected = "https://open.acast.com/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                                "/5dd81469bd860fd53f965cf7.mp3";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = "http://shows.pippa.io/cdanslair/episodes" +
                            "/hongkong-la-colere-monte-pekin-menace-19-11-2019";
        const options = { depth: 0, incognito: false };
        const expected = "https://open.acast.com/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                                "/5dd4250950a8cbb62f4b21ad.mp3";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL from acast", async function () {
        const url = "https://shows.acast.com/cdanslair/episodes" +
                             "/chine-le-virus-qui-inquiete-le-monde-22-01-2020";
        const options = { depth: 0, incognito: false };
        const expected = "https://open.acast.com/public/streams" +
                                          "/5bb36892b799143c5a063e7f/episodes" +
                                                "/5e288874bd860fd53f96625f.mp3";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
