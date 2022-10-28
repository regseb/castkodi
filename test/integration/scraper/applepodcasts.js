import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Apple Podcasts", function () {
    it("should return URL when it's not an audio", async function () {
        const url = new URL("https://podcasts.apple.com/us/podcast" +
                                                            "/culture-1999/id");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return audio URL", async function () {
        // Récupérer un podcast récent car ils ne sont pas gardés indéfiniment.
        const response = await fetch("https://podcasts.apple.com/fr/podcast" +
                          "/les-journaux-de-france-bleu-provence/id1041742167");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL(doc.querySelector(".tracks a").href);
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://rf.proxycast.org/"),
                  `"${file}"?.startsWith(...) from ${url}`);
        assert.ok(file?.endsWith(".mp3"),
                  `"${file}"?.endsWith(...) from ${url}`);
    });
});
