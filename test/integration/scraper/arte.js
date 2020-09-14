import assert      from "assert";
import { config }  from "../config.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Arte", function () {
    before(function () {
        if (null !== config.country && "de" !== config.country &&
                "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return URL when video is unavailable", async function () {
        const url = new URL("https://www.arte.tv/fr/videos/067125-020-A" +
                                                             "/bits-top-list/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return french video URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        // Récupérer le dernier de la liste pour ne pas prendre des vidéos qui
        // ne sont pas encore disponibles.
        const url = new URL(doc.querySelector(".teaserItem:last-child a").href);
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.endsWith(".mp4") || file.endsWith("/master.m3u8"),
                  `"${file}".endsWith(...) from ${url}`);
    });

    it("should return german video URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/de/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        // Récupérer le dernier de la liste pour ne pas prendre des vidéos qui
        // ne sont pas encore disponibles.
        const url = new URL(doc.querySelector(".teaserItem:last-child a").href);
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.endsWith(".mp4") || file.endsWith("/master.m3u8"),
                  `"${file}".endsWith(...) from ${url}`);
    });
});
