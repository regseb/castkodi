/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: OK", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://ok.ru/video/42");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://ok.ru/video/7632854583838?st._aid=VideoState_open_top",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith("https://m.ok.ru/dk?st.cmd=moviePlaybackRedirect"),
            `"${file}"?.startsWith(...)`,
        );
    });

    it("should return video URL from mobile", async function () {
        const url = new URL("https://m.ok.ru/video/4773298047496");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith("https://m.ok.ru/dk?st.cmd=moviePlaybackRedirect"),
            `"${file}"?.startsWith(...)`,
        );
    });
});
