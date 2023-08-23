/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VideoPress", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://videopress.com/v/foo");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when it isn't a video embed", async function () {
        const url = new URL("https://videopress.com/embed/foo");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://videopress.com/v/OcobLTqC");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://videos.files.wordpress.com/OcobLTqC/img_5786.m4v",
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL(
            "https://videopress.com/embed/knHSQ2fb?hd=0&autoPlay=0",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://videos.files.wordpress.com/knHSQ2fb/pexel-stock-video.mp4",
        );
    });
});
