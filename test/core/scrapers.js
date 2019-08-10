import assert      from "assert";
import { extract } from "../../src/core/scrapers.js";

describe("scrapers", function () {
    describe("#extract()", function () {
        it("should support URL", function () {
            const url = "http://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should support uppercase URL", function () {
            const url = "HTTPS://VIMEO.COM/195613867";
            const expected = "plugin://plugin.video.vimeo/";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });

        it("should support correctly question mark in pattern", function () {
            const url = "https://vid.ly/i2x4g5.mp4?quality=hd";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://kodi.tv/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("#rummage()", function () {
        it("should return the URL when it's not a page HTML", function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the MP3 URL", function () {
            const url = "https://fr.wikipedia.org/wiki/awesome.MP3";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return the AVI URL", function () {
            const url = "http://example.org/video.avi";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });

        it("should return Gamekult video URL", function () {
            const url = "https://www.gamekult.com/emission" +
                        "/gautoz-fait-sa-moisson-de-pixels-a-l-evenement-inde" +
                                                             "-3050806583.html";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x6m0tlk";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return YT Home video URL", function () {
            const url = "https://yt.ax/watch" +
                        "/how-to-make-perfect-chocolate-chip-cookies-40889071/";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=rEdl2Uetpvo";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
