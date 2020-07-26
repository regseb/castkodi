import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Radio", function () {
    it("should return URL when it's not an audio", async function () {
        const url = new URL("https://www.radio.net/s/notfound");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return audio URL", async function () {
        const url = new URL("https://www.radio.net/s/fip");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://icecast.radiofrance.fr/fip-hifi.aac");
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = new URL("http://www.radio.net/s/franceinter");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://icecast.radiofrance.fr/franceinter-midfi.mp3");
    });

    it("should return audio URL when URL has subdomain", async function () {
        const url = new URL("https://br.radio.net/s/antena1br");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "http://antena1.newradio.it/stream/1/");
    });

    it("should return audio URL from french version", async function () {
        const url = new URL("https://www.radio.fr/s/franceinfo");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://direct.franceinfo.fr/live/franceinfo-midfi.mp3");
    });
});
