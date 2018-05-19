import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/video", function () {
    describe("*://*/*.asf", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.asf";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.avi", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.avi";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.flv", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.flv";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mkv", function () {
        it("should return the same URL", function () {
            const url = "http://arcagenis.org/mirror/mango/ToS/" +
                                                      "tears_of_steel_720p.mkv";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mov", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.mov";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.mp4", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.mp4";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://*/*.wmv", function () {
        it("should return the same URL", function () {
            const url = "http://example.org/video.wmv";
            const expected = url;
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
