import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Bally Sports", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.ballysports.com/watch/vod/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    // Désactiver ce test car jsdom (avec nwsapi) n'est pas identique à
    // DOMParser des navigateurs. https://github.com/jsdom/jsdom/issues/3416
    it.skip("should return video URL", async function () {
        const url = new URL("https://www.ballysports.com/watch/vod" +
                      "/hunter-greene-has-made-a-habit-of-giving-back-to-kids");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://fr.vid.web.acsta.net/nmedia/33/18/02/23/15" +
                                                        "/19577157_hd_013.mp4");
    });
});
