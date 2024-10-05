/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Bigo Live", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.bigo.tv/games");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        // Récupérer l'URL d'une vidéo avec l'API de Bigo Live.
        const response = await fetch(
            "https://ta.bigo.tv/official_website/OInterfaceWeb/vedioList/11",
        );
        const json = await response.json();

        const url = new URL(`https://www.bigo.tv/${json.data.data[0].bigo_id}`);
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });

    it("should return video URL from french version", async function () {
        // Récupérer l'URL d'une vidéo avec l'API de Bigo Live.
        const response = await fetch(
            "https://ta.bigo.tv/official_website/OInterfaceWeb/vedioList/11",
        );
        const json = await response.json();

        const url = new URL(
            `https://www.bigo.tv/fr/${json.data.data[0].bigo_id}`,
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });

    it("should return URL when it's offline", async function () {
        const url = new URL("https://www.bigo.tv/0");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return URL when it isn't a channel", async function () {
        const url = new URL("https://www.bigo.tv/0123456789876543210");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });
});
