/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Chaos Computer Club (media.ccc.de)", function () {
    it("should return URL when it isn't a video", async function () {
        const url = new URL("https://media.ccc.de/about.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL [video]", async function () {
        const url = new URL(
            "https://media.ccc.de/v/petitfoo-54995-youtube-apps",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://cdn.media.ccc.de/contributors/essen/petitfoo/h264-fhd" +
                "/petitfoo-54995-deu-Youtube-Apps_fhd.mp4",
        );
    });
});
