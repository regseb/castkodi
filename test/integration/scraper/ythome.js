import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: YT Home", function () {
    it("should return video URL", async function () {
        const url = "https://yt.ax/watch" +
                        "/how-to-make-perfect-chocolate-chip-cookies-40889071/";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=rEdl2Uetpvo" +
                                                       "&incognito=false";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL from short link", async function () {
        const url = "https://yt.ax/rEdl2Uetpvo";
        const options = { depth: 0, incognito: true };
        const expected = "plugin://plugin.video.youtube/play/" +
                                                       "?video_id=rEdl2Uetpvo" +
                                                       "&incognito=true";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
