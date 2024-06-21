/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: CBC Listen", function () {
    it("should return undefined when clip not found", async function () {
        const url = new URL(
            "https://www.cbc.ca/listen/live-radio/1-666-foo/clip/666-bar",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL from clip", async function () {
        const url = new URL(
            "https://www.cbc.ca/listen/live-radio/1-429-what-on-earth/clip" +
                "/16073468-a-climate-career-counsellor-yes-thing.",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://mp3.cbc.ca/radio/2024/06/07/dave-GxiJx0U9-20240607.mp3",
        );
    });

    it("should return undefined when episode not found", async function () {
        const url = new URL(
            "https://www.cbc.ca/listen/cbc-podcasts/666-foo/episode/666-bar",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL from episode", async function () {
        const url = new URL(
            "https://www.cbc.ca/listen/cbc-podcasts/1401-bloodlines/episode" +
                "/16022603-episode-5-the-crater",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://podcast-a.akamaihd.net/mp3/podcasts/bloodlines" +
                "/bloodlines-By56H40U-20231110.mp3",
        );
    });
});
