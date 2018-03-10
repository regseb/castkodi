"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

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
            const url = "https://www.facebook.com/mozilla/";
            return module.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://www.facebook.com/*/videos/*/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.facebook.com/XBMC/videos/666/";
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
            const url = "https://www.facebook.com/XBMC/videos/" +
                                                           "10152476888501641/";
            const expected = "https://video-cdg2-1.xx.fbcdn.net/v/t43.1792-2/" +
                                  "10810554_10152476888596641_2070058545_n.mp4";
            return module.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected));
            });
        });
    });
});
