/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Uqload", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://uqload.com/checkfiles.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when video was deleted", async function () {
        const url = new URL("https://uqload.com/k1phujbh3t7d.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://uqload.com/5x0cgygu2bgg.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                file.endsWith(
                    "/v.mp4|Referer=https://uqload.com/5x0cgygu2bgg.html",
                ),
            `"${file}".endsWith(...)`,
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://uqload.com/embed-5x0cgygu2bgg.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                file.endsWith(
                    "/v.mp4|Referer=https://uqload.com/embed-5x0cgygu2bgg.html",
                ),
            `"${file}".endsWith(...)`,
        );
    });
});
