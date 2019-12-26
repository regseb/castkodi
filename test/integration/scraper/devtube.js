import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: DevTube", function () {
    it("should return video id", async function () {
        const url = "https://dev.tube/video/4rWypxBwrR4";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=4rWypxBwrR4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
