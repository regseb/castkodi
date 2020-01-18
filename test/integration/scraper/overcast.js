import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Overcast", function () {
    it("should return video URL", async function () {
        const url = "https://overcast.fm/+JUKOBdbAM";
        const expected = "https://tracking.feedpress.it/link/17512/13061508" +
                                                         "/b6710001_tc.mp3#t=0";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
