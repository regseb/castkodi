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

    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.tiktok.com/about?lang=fr");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when it isn't a video (and there isn't data)", async function () {
        const url = new URL("https://www.tiktok.com/upload");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.tiktok.com/@the90guy/video/6710341586984635654" +
                "?langCountry=fr",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
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
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                "video_mp4" === new URL(file).searchParams.get("mime_type"),
            `"..." === new URL("${file}").searchParams.get("mime_types")`,
        );
    });
});
