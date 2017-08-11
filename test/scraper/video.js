"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/video", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("*://*/*.asf", function () {
        it("should return the same URL", function () {
            const url = new URL("http://example.org/video.asf");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.avi", function () {
        it("should return the same URL", function () {
            const url = new URL("http://example.org/video.avi");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.flv", function () {
        it("should return the same URL", function () {
            const url = new URL("http://example.org/video.flv");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mkv", function () {
        it("should return the same URL", function () {
            const url = new URL("http://arcagenis.org/mirror/mango/ToS/" +
                                                     "tears_of_steel_720p.mkv");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mov", function () {
        it("should return the same URL", function () {
            const url = new URL("http://example.org/video.mov");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mp4", function () {
        it("should return the same URL", function () {
            const url = new URL("http://example.org/video.mp4");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.wmv", function () {
        it("should return the same URL", function () {
            const url = new URL("http://example.org/video.wmv");
            const expected = url.toString();
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 1);
                assert.strictEqual(file, expected);
            });
        });
    });
});
