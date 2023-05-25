/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Bigo Live", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.bigo.tv/games");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        // Récupérer l'URL d'une vidéo avec l'API de Bigo Live.
        const response = await fetch(
            "https://www.bigo.tv/OInterfaceWeb/vedioList/11" +
                "?tabType=00&fetchNum=1",
        );
        const json = await response.json();

        const url = new URL(`https://www.bigo.tv/${json.data.data[0].bigo_id}`);
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });

    it("should return video URL from french version", async function () {
        // Récupérer l'URL d'une vidéo avec l'API de Bigo Live.
        const response = await fetch(
            "https://www.bigo.tv/OInterfaceWeb/vedioList/11" +
                "?tabType=00&fetchNum=1",
        );
        const json = await response.json();

        const url = new URL(
            `https://www.bigo.tv/fr/${json.data.data[0].bigo_id}`,
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".m3u8"),
            `new URL("${file}").pathname.endsWith(...) from ${url}`,
        );
    });

    it("should return URL when it isn't a live", async function () {
        const url = new URL("https://www.bigo.tv/0");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });
});
