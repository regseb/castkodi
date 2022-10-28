import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Vidyard", function () {
    it("should return video URL from watch page", async function () {
        const url = new URL("https://video.vidyard.com/watch" +
                                                    "/sZLW7HbuBytapHnaGNDRYP?");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://cdn.vidyard.com/media/hls" +
                             "/ANNZVaQ7Jr4FJFpv36A-IQ/full_hd.mp4/index.m3u8?"),
                  `"${file}"?.startsWith(...)`);
    });

    it("should return video URL from iframe", async function () {
        const url = new URL("https://play.vidyard.com/T3dY7vWGe3kCzH4RtSRKSD" +
                                     "?disable_popouts=1&v=4.2.31&type=inline");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://cdn.vidyard.com/media/hls" +
                             "/ZoUHbEeXnQtGWB_F_LOogQ/full_hd.mp4/index.m3u8?"),
                  `"${file}"?.startsWith(...)`);
    });
});
