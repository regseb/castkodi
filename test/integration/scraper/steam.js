import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Steam", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://store.steampowered.com/app/400/Portal/";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://store.steampowered.com/app/620/Portal_2/";
        const expected = "https://steamcdn-a.akamaihd.net/steam/apps" +
                                            "/81613/movie_max.mp4?t=1452903069";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://store.steampowered.com/app/322500/SUPERHOT/";
        const expected = "https://steamcdn-a.akamaihd.net/steam/apps" +
                                        "/256682033/movie_max.mp4?t=1492645342";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return URL when it's not a broadcast", async function () {
        const url = "https://steamcommunity.com/broadcast/watch/404";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return broadcast URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil des fichiers.
        const response = await fetch("https://steamcommunity.com/apps" +
                                         "/allcontenthome?appHubSubSection=13");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a").href;
        const expected = {
            "start": /^https:\/\/[^.]+\.steamcontent\.com\/broadcast\//,
            "end":   ".broadcast.steamcontent.com:80"
        };

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(expected.start.test(file),
                  `expected.start.test("${file}") from ${url}`);
        assert.ok(file.endsWith(expected.end),
                  `"${file}".endsWith(expected.end) from ${url}`);
    });
});
