/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Steam", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://store.steampowered.com/bundle/234/Portal_Bundle/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://store.steampowered.com/app/620/Portal_2/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/movie_max.mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL(
            "http://store.steampowered.com/app/322500/SUPERHOT/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/movie_max.mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return undefined when it isn't a broadcast", async function () {
        const url = new URL("https://steamcommunity.com/broadcast/watch/404");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return broadcast URL", async function () {
        // Récupérer l'URL d'une vidéo sur la page d'accueil des diffusions.
        const response = await fetch(
            "https://steamcommunity.com/apps/allcontenthome" +
                "?appHubSubSection=13",
        );
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL(doc.querySelector("a").href);
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/master.m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });
});
