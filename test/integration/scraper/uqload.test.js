/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Uqload", () => {
    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://uqload.com/checkfiles.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when video was deleted", async () => {
        const url = new URL("https://uqload.com/k1phujbh3t7d.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async () => {
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

    it("should return video URL from embed", async () => {
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
