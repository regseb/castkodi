import assert        from "assert";
import * as scrapers from "../../src/core/scrapers.js";

describe("scrapers", function () {
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

        it("should support correctly magnet link", function () {
            const url = "magnet:?xt=12345";
            const expected = "plugin://plugin.video.elementum/play" +
                                                  "?uri=magnet%3A%3Fxt%3D12345";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should support correctly acestream link", function () {
            const url = "acestream://12345";
            const expected = "plugin://program.plexus/?mode=1&name=" +
                                                 "&url=acestream%3A%2F%2F12345";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
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
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.ok(err.title.includes(expected),
                          `"${err.title}".includes(expected)`);
                assert.ok(err.message.includes(expected),
                          `"${err.message}".includes(expected)`);
            });
        });
    });

    describe("#rummage()", function () {
        it("should return the URL when it's not a page HTML", function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the MP3 URL", function () {
            const url = "https://fr.wikipedia.org/wiki/awesome.MP3";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the AVI URL", function () {
            const url = "http://example.org/video.avi";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return Gamekult URL", function () {
            const url = "https://www.gamekult.com/emission" +
                        "/gautoz-fait-sa-moisson-de-pixels-a-l-evenement-inde" +
                                                             "-3050806583.html";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x6m0tlk";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
