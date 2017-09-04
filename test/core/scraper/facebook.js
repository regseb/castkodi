"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

global.fetch   = require("node-fetch");
global.browser = require("../../mock/browser");

requirejs.config({
    "baseUrl":     "src/core",
    "nodeRequire": require
});

describe("scraper/facebook", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("https://www.facebook.com/mozilla/");
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

    describe("https://www.facebook.com/*/videos/*/*", function () {
        it("should return error when it's not a video", function () {
            const url = new URL("https://www.facebook.com/XBMC/videos/666/");
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
            const url = new URL("https://www.facebook.com/XBMC/videos/" +
                                                          "10152476888501641/");
            const expected = "https://video-cdg2-1.xx.fbcdn.net/v/t43.1792-2/" +
                                  "10810554_10152476888596641_2070058545_n.mp4";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.ok(file.startsWith(expected));
            });
        });
    });
});
