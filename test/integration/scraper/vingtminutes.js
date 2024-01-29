/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: 20 Minutes", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://www.20minutes.fr/high-tech" +
                "/2694715-20200114-mozilla-devoile-son-assistant-virtuel" +
                "-pense-pour-firefox",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [ldjson-ultimedia]", async function () {
        const url = new URL(
            "https://www.20minutes.fr/sciences" +
                "/2697215-20200117-ariane-5-succes-premier-lancement-annee",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith(
                    "/59/6b/596b282e57e592e47df9a6f0434f3281f82b79df.mp4",
                ),
            `"new URL(${file}).pathname.endsWith(...)`,
        );
    });
});
