"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src/core",
    "nodeRequire": require
});

describe("scraper/mixcloud", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a music", function () {
            const url = new URL("https://www.mixcloud.com/upload/");
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

    describe("https://www.mixcloud.com/*/*/", function () {
        it("should return error when it's not a music", function () {
            const url = new URL("https://www.mixcloud.com/discover/jazz/");
            const expected = "noaudio";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return music id", function () {
            const url = new URL("https://www.mixcloud.com" +
                                       "/LesGar%C3%A7onsBienElev%C3%A9s/n101/");
            const expected = "plugin://plugin.audio.mixcloud/" +
                              "?mode=40" +
                              "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s" +
                                   "%2Fn101%2F";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
    });
});
