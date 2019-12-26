import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dailymotion", function () {
    it("should return video id", async function () {
        const url = "https://www.dailymotion.com/video/x17qw0a";
        const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x17qw0a";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return tiny video id", async function () {
        const url = "http://dai.ly/x5riqme";
        const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x5riqme";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return embed video id", async function () {
        const url = "https://www.dailymotion.com/embed/video/a12bc3d";
        const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=a12bc3d";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
