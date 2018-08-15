import assert        from "assert";
import * as scrapers from "../../src/core/scrapers.js";

describe("scrapers", function () {
    describe("#SCRAPERS", function () {
        it("should be a non-empty array", function () {
            assert.ok(Array.isArray(scrapers.SCRAPERS),
                      `Array.isArray(${scrapers.SCRAPERS})`);
            assert.notStrictEqual(scrapers.SCRAPERS.length, 0);
        });

        it("should have 'pattern' property", function () {
            for (const scraper of scrapers.SCRAPERS) {
                assert.ok("pattern" in scraper, `"pattern" in ${scraper}`);
            }
        });

        it("should have 'regexp' property", function () {
            for (const scraper of scrapers.SCRAPERS) {
                assert.ok("regexp" in scraper, `"regexp" in ${scraper}`);
            }
        });

        it("should have 'action' property", function () {
            for (const scraper of scrapers.SCRAPERS) {
                assert.ok("action" in scraper, `"action" in ${scraper}`);
            }
        });
    });

    describe("#extract()", function () {
        it("should support URL", function () {
            const url = "http://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/";
            return scrapers.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should support uppercase URL", function () {
            const url = "HTTPS://VIMEO.COM/195613867";
            const expected = "plugin://plugin.video.vimeo/";
            return scrapers.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should support correctly question mark in pattern", function () {
            const url = "https://vid.ly/i2x4g5.mp4?quality=hd";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://kodi.tv/";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return error when it's a invalid URL", function () {
            const url = "http://Cast Kodi/flac";
            const expected = "noLink";
            return scrapers.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });
    });
});
