/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Labeler: Twitch", function () {
    it("should return channel label", async function () {
        // Récupérer l'URL d'une chaine en live en passant par la version
        // mobile, car la version classique charge le contenu de la page en
        // asynchrone avec des APIs.
        const response = await fetch("https://m.twitch.tv/directory/all");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL(
            "https://m.twitch.tv" +
                doc
                    .querySelector('[role="list"] a.tw-link')
                    .getAttribute("href"),
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.equal(item.file, file);
        assert.equal(typeof item.label, "string", `from ${url}`);
        assert.notEqual(item.label, "", `from ${url}`);
        assert.equal(item.position, 0);
        assert.equal(item.title, "");
        assert.equal(item.type, "unknown");
    });

    it("should return default label when channel is offline", async function () {
        const url = new URL("https://www.twitch.tv/nolife");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Nolife",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return video label", async function () {
        // Récupérer l'URL d'une vidéo en passant par la version mobile, car la
        // version classique charge le contenu de la page en asynchrone avec des
        // APIs.
        const response = await fetch("https://m.twitch.tv/canardpc/videos");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");

        const url = new URL(
            "https://m.twitch.tv" +
                doc
                    .querySelector('a.tw-link[href^="/videos/"]')
                    .getAttribute("href"),
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        const item = await complete({
            file,
            label: "",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.equal(item.file, file);
        assert.equal(typeof item.label, "string", `from ${url}`);
        assert.notEqual(item.label, "", `from ${url}`);
        assert.equal(item.position, 0);
        assert.equal(item.title, "");
        assert.equal(item.type, "unknown");
    });
});
