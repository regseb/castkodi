import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ace Stream", function () {
    it("should return video URL", async function () {
        const url = "acestream://94c2fd8fb9bc8f2fc71a2cbe9d4b866f227a0209";
        const expected = "plugin://program.plexus/?mode=1&name=" +
                                          "&url=acestream%3A%2F%2F94c2fd8fb9b" +
                                                "c8f2fc71a2cbe9d4b866f227a0209";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
