/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Melty", function () {
    it("should ignore page without video", async function () {
        const url = new URL(
            "https://www.melty.fr/high-tech" +
                "/internet-explorer-va-officiellement-disparaitre-1007121.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return URL", async function () {
        const url = new URL(
            "https://www.melty.fr/le-joker-la-fin-alternative-bien-plus" +
                "-sombre-revelee-a703715.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/" +
                "?mode=playVideo&url=k6ogQps3cfOar4x7ZXf",
        );
    });
});
