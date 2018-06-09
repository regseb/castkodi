import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/audio", function () {
    describe("*://*/*aac*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.aac";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the same URL with query", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.aac?kbps=128";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*aiff*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/music.aiff";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the same URL with hash", function () {
            const url = "https://fr.wikipedia.org/wiki/music.aiff#c2";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*ape", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/zic.ape";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/ape";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*flac*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.flac";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*m4a*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki.m4a";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*midi*", function () {
        it("should return the same URL with query and hash", function () {
            const url = "https://fr.wikipedia.org/wiki/midi?foo#bar";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*mka*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.mka";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*mp3*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki.MP3";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*ogg*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.ogg";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*pls*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.pls";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*wav*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/file.wav";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*wma*", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/aaa.wma";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });
});
