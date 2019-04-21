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

        it("should return LiveLeak URL", function () {
            const url = "https://www.liveleak.com/view?t=HfVq_1535497667";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Aug/28/" +
                  "LiveLeak-dot-com-Untitled_1535497475.wmv.5b85d54bbb2dd.mp4?";
            return scrapers.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return LiveLeak URL even when URL contains" +
                                                       " \"mp4\"", function () {
            const url = "https://www.liveleak.com/view?t=Cmp4X_1539969642";
            const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/" +
                                                                     "Oct/19/" +
                  "LiveLeak-dot-com-LaunchPadWaterDelugeSystemTestatNASAKenn_" +
                                            "1539969608.mp4.5bca1334cea29.mp4?";
            return scrapers.extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should return Útvarp Saga URL", function () {
            const url = "http://utvarpsaga.is/" +
                             "snjallsimarnir-eru-farnir-ad-stjorna-lifi-folks/";
            const expected = "http://utvarpsaga.is/file/" +
                                           "s%C3%AD%C3%B0degi-a-7.9.18.mp3?_=1";
            return scrapers.extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
