import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Full30", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.full30.com/video/foobar";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "http://www.full30.com/video" +
                                            "/01c970fbc3cf59528c3daaa3a4020edb";
        const expected = "https://us.videos.epicio.net/public/full30v1/videos" +
                                                            "/demolitionranch" +
                                "/01c970fbc3cf59528c3daaa3a4020edb/854x480.mp4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not a video from watch page",
                                                             async function () {
        const url = "https://www.full30.com/watch/foobar";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL from watch page", async function () {
        const url = "https://www.full30.com/watch/MjY1/apple-devices-vs-50cal";
        const expected = "https://us.videos.epicio.net/public/full30v1/videos" +
                                                            "/demolitionranch" +
                                "/01c970fbc3cf59528c3daaa3a4020edb/854x480.mp4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
