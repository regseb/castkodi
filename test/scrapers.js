"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

global.browser = require("./mock/browser");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scrapers", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should be a non-empty array", function () {
            assert.strictEqual(Array.isArray(module.patterns), true);
            assert.notStrictEqual(module.patterns.length, 0);
        });
    });

    describe("#extract()", function () {
        it("should support valid URL", function () {
            const url = new URL("http://www.dailymotion.com/video/x17qw0a");
            const expected = "plugin://plugin.video.dailymotion_com/";
            return module.extract(url).then(function ({ file }) {
                assert.ok(file.startsWith(expected));
            });
        });

        it("should support uppercase valid URL", function () {
            const url = new URL("HTTPS://VIMEO.COM/195613867");
            const expected = "plugin://plugin.video.vimeo/";
            return module.extract(url).then(function ({ file }) {
                assert.ok(file.startsWith(expected));
            });
        });

        it("should support correctly point in pattern", function () {
            const url = new URL("https://en.wikipedia.org/wiki/MP3");
            const expected = "unsupported";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return error when it's not a URL supported", function () {
            const url = new URL("https://kodi.tv/");
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
});
