import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Arte", function () {
    it("should return URL when video is unavailable", async function () {
        const url = "https://www.arte.tv/fr/videos/067125-020-A/bits-top-list/";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return french video URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/fr/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = "https://www.arte.tv" +
                    doc.querySelector(".highlights_category_ACT" +
                                      " a.next-teaser__link").href;
        const options = { "depth": 0, "incognito": false };
        const expected = {
            "start": "https://arteptweb-",
            "end":   [".mp4", "/master.m3u8"]
        };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected.start),
                  `"${file}".startsWith(expected.start) from ${url}`);
        assert.ok(file.endsWith(expected.end[0]) ||
                  file.endsWith(expected.end[1]),
                  `"${file}".endsWith(expected.end) from ${url}`);
    });

    it("should return german video URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil.
        const response = await fetch("https://www.arte.tv/de/");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = "https://www.arte.tv" +
                    doc.querySelector(".highlights_category_ACT" +
                                      " a.next-teaser__link").href;
        const options = { "depth": 0, "incognito": false };
        const expected = {
            "start": "https://arteptweb-",
            "end":   [".mp4", "/master.m3u8"]
        };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected.start),
                  `"${file}".startsWith(expected.start) from ${url}`);
        assert.ok(file.endsWith(expected.end[0]) ||
                  file.endsWith(expected.end[1]),
                  `"${file}".endsWith(expected.end) from ${url}`);
    });
});
