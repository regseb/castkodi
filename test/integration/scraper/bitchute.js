import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: BitChute", function () {
    it("should return video URL", async function () {
        const url = "https://www.bitchute.com/video/dz5JcCZnJMge/";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://seed126.bitchute.com/hU2elaB5u3kB" +
                                                            "/dz5JcCZnJMge.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
