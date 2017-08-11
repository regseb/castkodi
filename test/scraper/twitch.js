"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/twitch", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("https://www.twitch.tv/directory");
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

    describe("https://www.twitch.tv/videos/*", function () {
        it("should return video id", function () {
            const url = new URL("https://www.twitch.tv/videos/164088111");
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
