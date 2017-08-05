"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/vimeo", function () {
    let scraper;

    before(function (done) {
        requirejs(["scraper/vimeo"], function (vimeo) {
            scraper = vimeo;
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
            const url = new URL("https://fr.wikipedia.org/wiki/Vimeo");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return null when the url is invalid", function () {
            const url = new URL("https://vimeo.com/categories");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://vimeo.com/195613867");
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=195613867";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
