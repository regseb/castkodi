import assert        from "assert";
import * as scrapers from "../../src/core/scrapers.js";

describe("scrapers", function () {
    describe("#PATTERNS", function () {
        it("should be a non-empty array", function () {
            assert.ok(Array.isArray(scrapers.PATTERNS));
            assert.notStrictEqual(scrapers.PATTERNS.length, 0);
            assert.strictEqual(scrapers.PATTERNS.length,
                               scrapers.REGEXPS.length);
        });
    });

    describe("#REGEXPS", function () {
        it("should be a non-empty array", function () {
            assert.ok(Array.isArray(scrapers.REGEXPS));
            assert.notStrictEqual(scrapers.REGEXPS.length, 0);
            assert.strictEqual(scrapers.REGEXPS.length,
                               scrapers.PATTERNS.length);
        });
    });

    describe("#extract()", function () {
        it("should support valid URL", function () {
            const url = "http://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/";
            return scrapers.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected));
            });
        });

        it("should support uppercase valid URL", function () {
            const url = "HTTPS://VIMEO.COM/195613867";
            const expected = "plugin://plugin.video.vimeo/";
            return scrapers.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected));
            });
        });

        it("should support correctly question mark in pattern", function () {
            const url = "https://vid.ly/i2x4g5.mp4?quality=hd";
            const expected = url.toString();
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return URL when it's not supported", function () {
            const url = "https://kodi.tv/";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return error when it's empty string", function () {
            const url = "";
            const expected = "nolink";
            return scrapers.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return error when it's undefined", function () {
            const url = undefined;
            const expected = "nolink";
            return scrapers.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return error when it isn't a valid link", function () {
            const url = "foobar";
            const expected = "nolink";
            return scrapers.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });
    });
});
