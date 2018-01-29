"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src/core",
    "nodeRequire": require
});

describe("scraper/dumpert", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = "http://www.dumpert.nl/toppers/";
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

    describe("*://www.dumpert.nl/mediabase/*", function () {
        it("should return video id", function () {
            const url = "http://www.dumpert.nl/mediabase/7248279/" +
                                                  "47066e59/wheelie_in_ny.html";
            const expected = "plugin://plugin.video.dumpert/?action=play" +
                             "&video_page_url=http%3A%2F%2Fwww.dumpert.nl" +
                             "%2Fmediabase%2F7248279%2F47066e59" +
                             "%2Fwheelie_in_ny.html";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
