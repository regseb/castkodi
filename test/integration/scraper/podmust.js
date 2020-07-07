import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: PodMust", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://podmust.com/fr/?s=foo";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return audio URL [audio]", async function () {
        const url = "https://podmust.com/podcast/le-billet-de-chris-esquerre/";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(".mp3"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return audio URL from home page [audio]", async function () {
        // Récupérer l'URL d'un podcast sur la page d'accueil.
        const response = await fetch("https://podmust.com/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a.tile").href;
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(".mp3"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
