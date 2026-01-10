/**
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
        // Récupérer l'URL d'une vidéo du Journal 20h00.
        const response = await fetch(
            "https://www.france.tv/france-2/journal-20h00/",
        );
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const a = doc.querySelector(
            'a[aria-label^="Journal 20h00 . Édition du"]',
        );

        const url = new URL(a.getAttribute("href"), "https://www.france.tv/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/master.m3u8"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
