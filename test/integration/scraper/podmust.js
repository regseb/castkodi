import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: PodMust", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://podmust.com/tendances-podcast-2021/";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL", async function () {
        const url = "https://podmust.com/podcast/le-billet-de-chris-esquerre/";
        const options = { "depth": 0, "incognito": false };
        const expected = "http://rf.proxycast.org" +
                                       "/c7e40c49-a922-441c-b423-10daeb6b7b6d" +
                                   "/19736-30.01.2020-ITEMA_22269047-0.mp3?_=1";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when protocol is HTTP", async function () {
        // Récupérer l'URL d'un podcast sur la page d'accueil.
        const response = await fetch("https://podmust.com/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a.tile").href;
        const options = { "depth": 0, "incognito": false };
        const expected = {
            "start": "http://rtl.proxycast.org/",
            "end":   ".mp3?_=1"
        };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected.start),
                  `"${file}".startsWith(expected.start) from ${url}`);
        assert.ok(file.endsWith(expected.end),
                  `"${file}".endsWith(expected.end) from ${url}`);
    });
});
