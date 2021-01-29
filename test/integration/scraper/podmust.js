import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: PodMust", function () {
    it("should return audio URL [audio]", async function () {
        const url = new URL("https://podmust.com/podcast/sixieme-science/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".mp3"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return audio URL from home page [audio]", async function () {
        // Récupérer l'URL d'un podcast sur la page d'accueil.
        const response = await fetch("https://podmust.com/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL(doc.querySelector("a.tile").href);
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith(".mp3"),
                  `new URL("${file}").pathname.endsWith(...) from ${url}`);
    });
});
