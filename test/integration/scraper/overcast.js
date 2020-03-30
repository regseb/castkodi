import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Overcast", function () {
    it("should return video URL", async function () {
        const url = "https://overcast.fm/+JUKOBdbAM";
        const options = { depth: 0, incognito: false };
        const expected = ".mp3";

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(expected),
                  `new URL("${file}").pathname.endsWith(expected)`);
    });
});
