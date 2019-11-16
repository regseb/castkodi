import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/radio.js";

describe("scraper/radio", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://www.radio.net/top-stations";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://*.radio.net/s/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://www.radio.net/s/notfound";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "https://www.radio.net/s/fip";
            const expected = "http://icecast.radiofrance.fr/fip-hifi.aac";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "http://www.radio.net/s/franceinter";
            const expected = "http://icecast.radiofrance.fr" +
                                                       "/franceinter-midfi.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when URL has subdomain", async function () {
            const url = "https://br.radio.net/s/antena1br";
            const expected = "http://antena1.newradio.it/stream/1/";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.radio.fr/s/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return audio URL", async function () {
            const url = "https://www.radio.fr/s/franceinfo";
            const expected = "http://direct.franceinfo.fr/live" +
                                                        "/franceinfo-midfi.mp3";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
