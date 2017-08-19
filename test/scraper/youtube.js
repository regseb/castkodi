"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

global.browser = require("../mock/browser");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/youtube", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("https://www.youtube.com/feed/trending");
            const expected = "unsupported";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });
    });

    describe("https://www.youtube.com/watch*", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("https://www.youtube.com/watch?x=123456");
            const expected = "novideo";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return playlist id", function () {
            const url = new URL("https://www.youtube.com/watch" +
                                    "?v=avt4ZWlVjdY" +
                                    "&list=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum");
            const expected = "plugin://plugin.video.youtube/" +
                                 "?action=play_all" +
                                 "&playlist=PL7nedIL_qbuZBS5ZAiGkjB1LW9C3zZvum";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id", function () {
            const url = new URL("https://www.youtube.com/watch?v=sWfAtMQa_yo");
            const expected = "plugin://plugin.video.youtube/" +
                                                         "?action=play_video" +
                                                         "&videoid=sWfAtMQa_yo";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("https://m.youtube.com/playlist*", function () {
        it("should return error when it's not a playlist", function () {
            const url = new URL("https://www.youtube.com/playlist?foo=bar");
            const expected = "novideo";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return playlist id", function () {
            const url = new URL("https://www.youtube.com/playlist" +
                                    "?list=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9");
            const expected = "plugin://plugin.video.youtube/" +
                                 "?action=play_all" +
                                 "&playlist=PLd8UclkuwTj9vaRGP3859UHcdmlrkAd-9";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("https://youtu.be/*", function () {
        it("should return video id", function () {
            const url = new URL("https://youtu.be/NSFbekvYOlI");
            const expected = "plugin://plugin.video.youtube/" +
                                                         "?action=play_video" +
                                                         "&videoid=NSFbekvYOlI";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("https://m.youtube.com/watch*", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("https://m.youtube.com/watch?a=dQw4w9WgXcQ");
            const expected = "novideo";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return video id", function () {
            const url = new URL("https://m.youtube.com/watch?v=dQw4w9WgXcQ");
            const expected = "plugin://plugin.video.youtube/" +
                                                         "?action=play_video" +
                                                         "&videoid=dQw4w9WgXcQ";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("https://m.youtube.com/playlist*", function () {
        it("should return error when it's not a playlist", function () {
            const url = new URL("https://m.youtube.com/playlist" +
                                                   "?video=PL3A5849BDE0581B19");
            const expected = "novideo";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return playlist id", function () {
            const url = new URL("https://m.youtube.com/playlist" +
                                                    "?list=PL3A5849BDE0581B19");
            const expected = "plugin://plugin.video.youtube/" +
                                                 "?action=play_all" +
                                                 "&playlist=PL3A5849BDE0581B19";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
