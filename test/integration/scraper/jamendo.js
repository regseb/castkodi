import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Jamendo", function () {
    it("should return URL when it's not a sound", async function () {
        const url = "https://www.jamendo.com/track/404/not-found";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio URL", async function () {
        const url = "https://www.jamendo.com/track/3431/avant-j-etais-trappeur";
        const expected = "https://mp3l.jamendo.com/" +
                                  "?trackid=3431&format=mp31&from=app-97dab294";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = "http://www.jamendo.com/track/33454/vacance-au-camping";
        const expected = "https://mp3l.jamendo.com/" +
                                 "?trackid=33454&format=mp31&from=app-97dab294";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
