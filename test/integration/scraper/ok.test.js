/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: OK", () => {
    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://ok.ru/video/42");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async () => {
        const url = new URL(
            "https://ok.ru/video/7632854583838?st._aid=VideoState_open_top",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(new URL(file).pathname, "/video.m3u8");
    });

    it("should return video URL from mobile", async () => {
        const url = new URL("https://m.ok.ru/video/4773298047496");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(new URL(file).pathname, "/video.m3u8");
    });
});
