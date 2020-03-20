import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: PodMust", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://podmust.com/tendances-podcast-2021/";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL", async function () {
        const url = "https://podmust.com/podcast/le-billet-de-chris-esquerre/";
        const options = { depth: 0, incognito: false };
        const expected = ".mp3";

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(expected),
                  `new URL("${file}").pathname.endsWith(expected)`);
    });

    it("should return audio URL from home page", async function () {
        // Récupérer l'URL d'un podcast sur la page d'accueil.
        const response = await fetch("https://podmust.com/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a.tile").href;
        const options = { depth: 0, incognito: false };
        const expected = ".mp3";

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(expected),
                  `new URL("${file}").pathname.endsWith(expected)`);
    });
});
