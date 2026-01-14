/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";
import "../setup.js";

describe("Scraper: Arte [de/fr]", () => {
    before((t) => {
        if (
            undefined !== config.country &&
            "de" !== config.country &&
            "fr" !== config.country
        ) {
            t.skip();
        }
    });

    it("should return undefined when video is unavailable", async () => {
        const url = new URL(
            "https://www.arte.tv/fr/videos/067125-020-A/bits-top-list/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return french video URL", async () => {
        // Récupérer l'URL d'une vidéo affichée sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const a = doc.querySelector('a[href*="/videos/"]');

        const url = new URL(a.getAttribute("href"), "https://www.arte.tv/fr/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith(".mp4") || file?.endsWith(".m3u8"),
            `"${file}"?.endsWith(...) from ${url}`,
        );
    });

    it("should return german video URL", async () => {
        // Récupérer l'URL d'une vidéo affichée sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/de/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const a = doc.querySelector('a[href*="/videos/"]');

        const url = new URL(a.getAttribute("href"), "https://www.arte.tv/de/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith(".mp4") || file?.endsWith(".m3u8"),
            `"${file}"?.endsWith(...) from ${url}`,
        );
    });
});
