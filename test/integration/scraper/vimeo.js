/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Vimeo", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://vimeo.com/channels");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video id [opengraph-vimeo]", async function () {
        const url = new URL("https://vimeo.com/228786490");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=228786490:a81341a31d",
        );
    });

    it("should return video id when protocol is HTTP [opengraph-vimeo]", async function () {
        const url = new URL("http://vimeo.com/228786490");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=228786490:a81341a31d",
        );
    });

    it("should return video id from groups video [opengraph-vimeo]", async function () {
        const url = new URL("https://vimeo.com/groups/motion/videos/93206523");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=93206523:d496437eee",
        );
    });

    it("should return video id from unlisted video [opengraph-vimeo]", async function () {
        const url = new URL("https://vimeo.com/304887422/34c51f7a09");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=304887422:34c51f7a09",
        );
    });

    it("should return embed video id", async function () {
        const url = new URL("https://player.vimeo.com/video/228786490");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=228786490",
        );
    });

    it("should return embed video id from unlisted video", async function () {
        const url = new URL(
            "https://player.vimeo.com/video/304887422?autoplay=1&h=34c51f7a09",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=304887422:34c51f7a09",
        );
    });
});
