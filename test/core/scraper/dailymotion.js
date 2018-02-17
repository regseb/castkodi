"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src/core",
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
            const url = "http://www.dailymotion.com/fr/feed";
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
            const url = "https://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x17qw0a";
            return module.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://dai.ly/*", function () {
        it("should return tiny video id", function () {
            const url = "http://dai.ly/x5riqme";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x5riqme";
            return module.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://www.dailymotion.com/embed/video/*", function () {
        it("should return embed video id", function () {
            const url = "https://www.dailymotion.com/embed/video/a12bc3d";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=a12bc3d";
            return module.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
