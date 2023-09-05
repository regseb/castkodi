/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: France tv", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.france.tv/spectacles-et-culture/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.france.tv/france-3/des-racines-et-des-ailes" +
                "/2487199-sur-les-sentiers-du-littoral-du-cap-d-antibes-aux" +
                "-calanques.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/manifest.mpd"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
