import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VideoPress", function () {
    it("should return URL when there isn't id", async function () {
        const url = "https://videopress.com/v/";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not a video", async function () {
        const url = "https://videopress.com/embed/foo";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://videopress.com/v/kUJmAcSf";
        const options = { depth: 0, incognito: false };
        const expected = "https://videos.files.wordpress.com/kUJmAcSf" +
                                        "/bbb_sunflower_1080p_30fps_normal.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL from embed", async function () {
        const url = "https://videopress.com/embed/knHSQ2fb?hd=0&autoPlay=0";
        const options = { depth: 0, incognito: false };
        const expected = "https://videos.files.wordpress.com/knHSQ2fb" +
                                                       "/pexel-stock-video.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
