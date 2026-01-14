/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";
import "../setup.js";

describe("Scraper: TikTok [us]", () => {
    before((t) => {
        if (undefined !== config.country && "us" === config.country) {
            t.skip();
        }
    });

    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://www.tiktok.com/about?lang=fr");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when it isn't a video (and there isn't data)", async () => {
        const url = new URL("https://www.tiktok.com/upload");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async () => {
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
});
