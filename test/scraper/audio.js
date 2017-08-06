"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/audio", function () {
    let scraper;

    before(function (done) {
        requirejs(["scraper/audio"], function (audio) {
            scraper = audio;
            done();
        });
    });

    describe("#patterns", function () {
        it("should be a non-empty array", function () {
            assert.strictEqual(Array.isArray(scraper.patterns), true);
            assert.notStrictEqual(scraper.patterns.length, 0);
        });
    });

    describe("#extract()", function () {
        it("should return null when it's not a audio file", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/MP3");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should support audio file", function () {
            const url = new URL("http://podcasts.dequaliter.com/Studio404/" +
                                                     "Studio404_Avril2017.mp3");
            const expected = url.toString();
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });
});
