import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: KCAA Radio", function () {
    it("should return audio URL", async function () {
        const url = new URL("https://live.kcaastreaming.com/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://stream.kcaastreaming.com/kcaa.mp3");
    });
});
