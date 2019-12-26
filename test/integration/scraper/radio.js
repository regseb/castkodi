import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Radio", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://www.radio.net/s/notfound";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio URL", async function () {
        const url = "https://www.radio.net/s/fip";
        const expected = "http://icecast.radiofrance.fr/fip-hifi.aac";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = "http://www.radio.net/s/franceinter";
        const expected = "http://icecast.radiofrance.fr/franceinter-midfi.mp3";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when URL has subdomain", async function () {
        const url = "https://br.radio.net/s/antena1br";
        const expected = "http://antena1.newradio.it/stream/1/";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio URL from french version", async function () {
        const url = "https://www.radio.fr/s/franceinfo";
        const expected = "http://direct.franceinfo.fr/live" +
                                                        "/franceinfo-midfi.mp3";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
