import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Arte", function () {
    it("should return URL when video is unavailable", async function () {
        const url = "https://www.arte.tv/fr/videos/067125-020-A/bits-top-list/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return french video URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a.teaserItem").href;
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith("https://arteptweb-"),
                  `"${file}".startsWith(...) from ${url}`);
        assert.ok(file.endsWith(".mp4") || file.endsWith("/master.m3u8"),
                  `"${file}".endsWith(...) from ${url}`);
    });

    it("should return german video URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/de/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a.teaserItem").href;
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith("https://arteptweb-"),
                  `"${file}".startsWith(...) from ${url}`);
        assert.ok(file.endsWith(".mp4") || file.endsWith("/master.m3u8"),
                  `"${file}".endsWith(...) from ${url}`);
    });
});
