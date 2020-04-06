import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VideoPress", function () {
    it("should return URL when there isn't id", async function () {
        const url = "https://videopress.com/v/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return URL when it's not a video", async function () {
        const url = "https://videopress.com/embed/foo";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL", async function () {
        const url = "https://videopress.com/v/OcobLTqC";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://videos.files.wordpress.com/OcobLTqC/img_5786.m4v");
    });

    it("should return video URL from embed", async function () {
        const url = "https://videopress.com/embed/knHSQ2fb?hd=0&autoPlay=0";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://videos.files.wordpress.com/knHSQ2fb" +
                                                      "/pexel-stock-video.mp4");
    });
});
