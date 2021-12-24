import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Blender Video", function () {
    it("should return video URL [peertube]", async function () {
        const url = new URL("https://video.blender.org/w" +
                                                     "/pAQiVCgv2CsLg79KKXUoMw");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://video.blender.org/static/webseed" +
                               "/bf1f3fb5-b119-4f9f-9930-8e20e892b898-720.mp4");
    });

    it("should return video embed URL [peertube]", async function () {
        const url = new URL("https://video.blender.org/videos/embed" +
                                       "/a69d68a5-a0e0-4a80-9d66-49f093c97aaf");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://video.blender.org/static/webseed" +
                               "/a69d68a5-a0e0-4a80-9d66-49f093c97aaf-804.mp4");
    });
});
