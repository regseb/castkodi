import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/radio.js";

describe("scraper/radio", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.radio.net/top-stations";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*.radio.net/s/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not an audio", function () {
            const url = "https://www.radio.net/s/notfound";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio URL", function () {
            const url = "https://www.radio.net/s/fip";
            const expected = "http://icecast.radiofrance.fr/fip-hifi.aac";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio URL when protocol is HTTP", function () {
            const url = "http://www.radio.net/s/franceinter";
            const expected = "http://icecast.radiofrance.fr" +
                                                       "/franceinter-midfi.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio URL when URL has subdomain", function () {
            const url = "https://br.radio.net/s/antena1br";
            const expected = "http://antena1.newradio.it/stream/1/";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://www.radio.fr/s/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return audio URL", function () {
            const url = "https://www.radio.fr/s/franceinfo";
            const expected = "http://direct.franceinfo.fr/live" +
                                                        "/franceinfo-midfi.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
