import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: YT Home", function () {
    it("should return video URL [iframe-youtube]", async function () {
        const url = new URL("https://yt.ax/watch" +
                       "/how-to-make-perfect-chocolate-chip-cookies-40889071/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/?video_id=rEdl2Uetpvo" +
                                                            "&incognito=false");
    });

    it("should return video URL from short link [iframe-youtube]",
                                                             async function () {
        const url = new URL("https://yt.ax/rEdl2Uetpvo");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/?video_id=rEdl2Uetpvo" +
                                                             "&incognito=true");
    });
});
