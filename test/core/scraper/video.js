import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/video", function () {
    describe("*://*/*asf*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.asf";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the same URL", function () {
            const url = "http://example.org/video.asf?hd";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*avi*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.avi";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the same URL", function () {
            const url = "http://example.org/video.avi#";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*flv*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.flv";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the same URL", function () {
            const url = "http://example.org/videoflv";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*mkv*", function () {
        it("should return the same URL", function () {
            const url = "http://arcagenis.org/mirror/mango/ToS/" +
                                                      "tears_of_steel_720p.mkv";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*mov*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.mov";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*m4v*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.m4v";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*mp4*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*ogv*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.ogv";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*webm*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.webm";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*/*wmv*", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.wmv";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });
});
