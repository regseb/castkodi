import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Overcast", function () {
    it("should return video URL [audio]", async function () {
        const url = new URL("https://overcast.fm/+JUKOBdbAM");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".mp3"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
