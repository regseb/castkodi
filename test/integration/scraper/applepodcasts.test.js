/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Apple Podcasts", () => {
    it("should return undefined when it isn't an audio", async () => {
        const url = new URL(
            "https://podcasts.apple.com/fr/podcast/la-derni%C3%A8re" +
                "/id1766744611",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL", async () => {
        // Récupérer un podcast récent, car ils ne sont pas gardés indéfiniment.
        const response = await fetch(
            "https://podcasts.apple.com/fr/podcast" +
                "/les-journaux-de-france-bleu-provence/id1041742167",
        );
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL(doc.querySelector(".episode a").href);
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith("https://proxycast.radiofrance.fr/"),
            `"${file}"?.startsWith(...) from ${url}`,
        );
        assert.ok(
            file?.endsWith(".mp3"),
            `"${file}"?.endsWith(...) from ${url}`,
        );
    });
});
