"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/audio", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("*://*/*.aac", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/MP3.aac");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.flac", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/MP3.flac");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.m4a", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki.m4a");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mka", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/MP3.mka");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mp3", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki.MP3");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.ogg", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/MP3.ogg");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.pls", function () {
        it("should return the same URL", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/MP3.pls");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });
});
