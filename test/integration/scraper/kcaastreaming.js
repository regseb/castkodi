import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: KCAA Radio", function () {
    it("should return audio URL", async function () {
        const url = "http://live.kcaastreaming.com/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "http://stream.kcaastreaming.com:5222/kcaa.mp3");
    });
});
