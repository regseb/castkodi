"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/dailymotion", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("http://www.dailymotion.com/fr/feed");
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

    describe("*://www.dailymotion.com/video/*", function () {
        it("should return video id", function () {
            const url = new URL("https://www.dailymotion.com/video/x17qw0a");
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x17qw0a";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://dai.ly/*", function () {
        it("should return video id", function () {
            const url = new URL("http://dai.ly/x5riqme");
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x5riqme";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
