import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: KCAA Radio", function () {
    it("should return audio URL", async function () {
        const url = "http://live.kcaastreaming.com/";
        const expected = "http://stream.kcaastreaming.com:5222/kcaa.mp3";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
