/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Chaos Computer Club (media.ccc.de)", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://media.ccc.de/about.html");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [video]", async function () {
        const url = new URL(
            "https://media.ccc.de/v/petitfoo-54995-youtube-apps",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdn.media.ccc.de/contributors/essen/petitfoo/h264-fhd" +
                "/petitfoo-54995-deu-Youtube-Apps_fhd.mp4",
        );
    });
});
