import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VideosHub", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://videoshub.com/videos/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://videoshub.com/videos/25310930");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://dd5tb0cfadhae.cloudfront.net/59665_360p.m3u8");
    });
});
