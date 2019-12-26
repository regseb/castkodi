import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Útvarp Saga", function () {
    it("should return video URL", async function () {
        const url = "https://utvarpsaga.is/" +
                             "snjallsimarnir-eru-farnir-ad-stjorna-lifi-folks/";
        const expected = "https://www.utvarpsaga.is/file/" +
                                           "s%C3%AD%C3%B0degi-a-7.9.18.mp3?_=1";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
