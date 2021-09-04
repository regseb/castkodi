import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VideosHub", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://videoshub.com/videos/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://videoshub.com/videos/25319681");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://dd5tb0cfadhae.cloudfront.net/11516798_360p.m3u8");
    });
});
