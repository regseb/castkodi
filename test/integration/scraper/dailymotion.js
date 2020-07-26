import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dailymotion", function () {
    it("should return video id", async function () {
        const url = new URL("https://www.dailymotion.com/video/x17qw0a");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=x17qw0a");
    });

    it("should return tiny video id", async function () {
        const url = new URL("http://dai.ly/x5riqme");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=x5riqme");
    });

    it("should return embed video id", async function () {
        const url = new URL("https://www.dailymotion.com/embed/video/a12bc3d");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=a12bc3d");
    });
});
