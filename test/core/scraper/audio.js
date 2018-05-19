import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/audio", function () {
    describe("*://*/*.aac", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.aac";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.flac", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.flac";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.m4a", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki.m4a";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mka", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.mka";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mp3", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki.MP3";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.ogg", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.ogg";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.pls", function () {
        it("should return the same URL", function () {
            const url = "https://fr.wikipedia.org/wiki/MP3.pls";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
