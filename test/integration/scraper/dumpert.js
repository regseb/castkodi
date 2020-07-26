import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dumpert", function () {
    it("should return video URL", async function () {
        const url = new URL("https://www.dumpert.nl/item/7924631_3a727e30");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dumpert/?action=play" +
                                "&video_page_url=https%3A%2F%2Fwww.dumpert.nl" +
                                                  "%2Fitem%2F7924631_3a727e30");
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://www.dumpert.nl/item/7924631_3a727e30");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dumpert/?action=play" +
                                 "&video_page_url=http%3A%2F%2Fwww.dumpert.nl" +
                                                  "%2Fitem%2F7924631_3a727e30");
    });

    it("should return video URL from old page", async function () {
        const url = new URL("https://www.dumpert.nl/mediabase/7248279" +
                                                "/47066e59/wheelie_in_ny.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dumpert/?action=play" +
                                "&video_page_url=https%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                       "%2Fwheelie_in_ny.html");
    });
});
