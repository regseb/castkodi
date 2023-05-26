/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Flickr", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://www.flickr.com/photos/europeanspaceagency/48194834627/in" +
                "/album-72157709420314132/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.flickr.com/photos/nasahqphoto/50041655251/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "https://live.staticflickr.com/video/50041655251/5178cf57ec" +
                    "/1080p.mp4?",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });
});
