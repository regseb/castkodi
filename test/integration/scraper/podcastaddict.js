import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Podcast Addict", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://podcastaddict.com/app");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return audio URL [media]", async function () {
        const url = new URL("https://podcastaddict.com/episode" +
                                  "/https%3A%2F%2Fsphinx.acast.com%2Fp%2Fopen" +
                              "%2Fs%2F5b7ac427c6a58e726f576cff%2Fe%2F62b58124" +
                              "11883600129b5886%2Fmedia.mp3&podcastId=2238970");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://sphinx.acast.com/p/open/s/5b7ac427c6a58e726f576cff/e" +
                      "/62b5812411883600129b5886/media.mp3?from=PodcastAddict");
    });
});
