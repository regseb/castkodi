/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Radio", function () {
    it("should return undefined when it isn't an audio", async function () {
        const url = new URL("https://www.radio.net/country-selector");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL", async function () {
        const url = new URL("https://www.radio.net/s/fip");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://icecast.radiofrance.fr/fip-hifi.aac");
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = new URL("http://www.radio.net/s/franceinter");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://icecast.radiofrance.fr/franceinter-midfi.mp3",
        );
    });

    it("should return audio URL when URL has subdomain", async function () {
        const url = new URL("https://br.radio.net/s/antena1br");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://antenaone.crossradio.com.br/stream/1/");
    });

    it("should return audio URL from french version", async function () {
        const url = new URL("https://www.radio.fr/s/franceinfo");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://icecast.radiofrance.fr/franceinfo-midfi.mp3",
        );
    });
});
