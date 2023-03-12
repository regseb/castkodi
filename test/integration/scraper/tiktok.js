/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: TikTok", function () {
    before(function () {
        if (undefined !== config.country && "us" === config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return URL when it isn't a video", async function () {
        const url = new URL("https://www.tiktok.com/about?lang=fr");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return URL when it isn't a video (and there isn't data)", async function () {
        const url = new URL("https://www.tiktok.com/upload");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.tiktok.com/@the90guy/video/6710341586984635654" +
                "?langCountry=fr",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                "video_mp4" === new URL(file).searchParams.get("mime_type"),
            `"..." === new URL("${file}").searchParams.get("mime_types")`,
        );
    });

    it("should return video when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.tiktok.com/@the90guy/video/6710341586984635654",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                "video_mp4" === new URL(file).searchParams.get("mime_type"),
            `"..." === new URL("${file}").searchParams.get("mime_types")`,
        );
    });
});
