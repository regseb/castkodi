import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Steam", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://store.steampowered.com/app/400/Portal/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL", async function () {
        const url = "https://store.steampowered.com/app/620/Portal_2/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://steamcdn-a.akamaihd.net/steam/apps" +
                                           "/81613/movie_max.mp4?t=1452903069");
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://store.steampowered.com/app/322500/SUPERHOT/";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://steamcdn-a.akamaihd.net/steam/apps" +
                                       "/256682033/movie_max.mp4?t=1492645342");
    });

    it("should return URL when it's not a broadcast", async function () {
        const url = "https://steamcommunity.com/broadcast/watch/404";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return broadcast URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil des diffusions.
        const response = await fetch("https://steamcommunity.com/apps" +
                                         "/allcontenthome?appHubSubSection=13");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = doc.querySelector("a").href;
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith("/master.m3u8"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
