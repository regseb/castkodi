import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Full30", function () {
    it("should return video URL [noscript-video]", async function () {
        const url = new URL("https://www.full30.com/watch/MjY1" +
                                                     "/apple-devices-vs-50cal");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://us.videos.epicio.net/public/full30v1/videos" +
               "/demolitionranch/01c970fbc3cf59528c3daaa3a4020edb/854x480.mp4");
    });

    it("should return video URL from embed [noscript-video]",
                                                             async function () {
        const url = new URL("https://www.full30.com/embed/MDIzMDcw");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://us.videos.epicio.net/public/full30/videos/MDIzMDcw" +
                                                     "/transforms/854x480.mp4");
    });
});
