"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/youtube", function () {
    let scraper;

    before(function (done) {
        requirejs(["scraper/youtube"], function (youtube) {
            scraper = youtube;
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
            const url = new URL("https://fr.wikipedia.org/wiki/YouTube");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return null when the url is invalid", function () {
            const url = new URL("https://www.youtube.com/feed/trending");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return null when the url is invalid", function () {
            const url = new URL("https://www.youtube.com/watch?x=123456");
            return scraper.extract(url).then(function (data) {
                assert.strictEqual(data, null);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://www.youtube.com/watch" +
                                    "?v=avt4ZWlVjdY" +
                                    "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum");
            const expected = "plugin://plugin.video.youtube/" +
                                 "?action=play_all" +
                                 "&playlist=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://www.youtube.com/watch?v=sWfAtMQa_yo");
            const expected = "plugin://plugin.video.youtube/" +
                                                         "?action=play_video" +
                                                         "&videoid=sWfAtMQa_yo";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://m.youtube.com/watch?v=dQw4w9WgXcQ");
            const expected = "plugin://plugin.video.youtube/" +
                                                         "?action=play_video" +
                                                         "&videoid=dQw4w9WgXcQ";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://m.youtube.com/playlist" +
                                                    "?list=PL3A5849BDE0581B19");
            const expected = "plugin://plugin.video.youtube/" +
                                                 "?action=play_all" +
                                                 "&playlist=PL3A5849BDE0581B19";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });

        it("should return playlistid/file when the url is valid", function () {
            const url = new URL("https://youtu.be/NSFbekvYOlI");
            const expected = "plugin://plugin.video.youtube/" +
                                                         "?action=play_video" +
                                                         "&videoid=NSFbekvYOlI";
            return scraper.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
