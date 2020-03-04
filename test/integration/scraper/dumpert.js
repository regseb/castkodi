import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dumpert", function () {
    it("should return video URL", async function () {
        const url = "https://www.dumpert.nl/mediabase/7248279/47066e59" +
                                                          "/wheelie_in_ny.html";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.dumpert/?action=play" +
                                "&video_page_url=https%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                        "%2Fwheelie_in_ny.html";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://www.dumpert.nl/mediabase/7248279/47066e59" +
                                                          "/wheelie_in_ny.html";
        const options = { depth: 0, incognito: false };
        const expected = "plugin://plugin.video.dumpert/?action=play" +
                                 "&video_page_url=http%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                        "%2Fwheelie_in_ny.html";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
