/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Arte", function () {
    before(function () {
        if (
            undefined !== config.country &&
            "de" !== config.country &&
            "fr" !== config.country
        ) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when video is unavailable", async function () {
        const url = new URL(
            "https://www.arte.tv/fr/videos/067125-020-A/bits-top-list/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return french video URL", async function () {
        // Récupérer l'URL d'une vidéo parmi les vidéos les plus vues.
        const response = await fetch(
            "https://www.arte.tv/api/rproxy/emac/v4/fr/web/data/VIDEO_LISTING" +
                "/?videoType=MOST_VIEWED&authorizedAreas=ALL",
        );
        const json = await response.json();
        // Garder les éléments pointant vers une seule vidéo (et non vers une
        // liste de vidéos).
        const video = json.value.data.find((d) => !d.kind.isCollection);

        const url = new URL(video.url, "https://www.arte.tv/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith(".mp4") || file?.endsWith(".m3u8"),
            `"${file}"?.endsWith(...) from ${url}`,
        );
    });

    it("should return german video URL", async function () {
        // Récupérer l'URL d'une vidéo parmi les vidéos les plus vues.
        const response = await fetch(
            "https://www.arte.tv/api/rproxy/emac/v4/de/web/data/VIDEO_LISTING" +
                "/?videoType=MOST_VIEWED&authorizedAreas=ALL",
        );
        const json = await response.json();
        // Garder les éléments pointant vers une seule vidéo (et non vers une
        // liste de vidéos).
        const video = json.value.data.find((d) => !d.kind.isCollection);

        const url = new URL(video.url, "https://www.arte.tv/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith(".mp4") || file?.endsWith(".m3u8"),
            `"${file}"?.endsWith(...) from ${url}`,
        );
    });
});
