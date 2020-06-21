import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Jamendo", function () {
    it("should return URL when it's not a sound", async function () {
        const url = "https://www.jamendo.com/track/404/not-found";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return audio URL [opengraph]", async function () {
        const url = "https://www.jamendo.com/track/3431/avant-j-etais-trappeur";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith("https://mp3l.jamendo.com/?trackid=3431" +
                                                                "&format=mp31"),
                  `"${file}".startsWith(...)`);
    });

    it("should return audio URL when protocol is HTTP [opengraph]",
                                                             async function () {
        const url = "http://www.jamendo.com/track/33454/vacance-au-camping";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith("https://mp3l.jamendo.com/?trackid=33454" +
                                                                "&format=mp31"),
                  `"${file}".startsWith(...)`);
    });
});
