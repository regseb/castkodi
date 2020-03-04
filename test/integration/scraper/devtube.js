import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: DevTube", function () {
    it("should return video id", async function () {
        const url = "https://dev.tube/video/4rWypxBwrR4";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=4rWypxBwrR4" +
                                                       "&incognito=false";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
