"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/dailymotion", function () {
    let scraper;

    before(function (done) {
        requirejs(["scraper/dailymotion"], function (dailymotion) {
            scraper = dailymotion;
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
        it("should return null when the url is invalid", function () {
            const url = new URL("https://fr.wikipedia.org/wiki/Dailymotion");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return null when the url is invalid", function () {
            const url = new URL("https://www.dailymotion.com/fr/feed");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://www.dailymotion.com/video/x17qw0a");
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x17qw0a";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("http://dai.ly/x5riqme");
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x5riqme";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
