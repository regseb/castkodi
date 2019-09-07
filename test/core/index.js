import assert           from "assert";
import { extract, mux } from "../../src/core/index.js";

describe("index", function () {
    describe("#mux()", function () {
        it("should get from bookmark", function () {
            const info = { "bookmarkId": "1" };
            const expected = "https://www.foo.com/";
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get from bookmark (which returns two lines)", function () {
            const info = { "bookmarkId": "2" };
            const expected = "http://www.bar.fr/";
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should returns error from bookmark folder", function () {
            const info = { "bookmarkId": "3" };
            const expected = "noLink";
            return mux(info).then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            });
        });

        it("should get from selection", function () {
            const info = { "selectionText": "https://foo.io/" };
            const expected = info.selectionText;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get from link", function () {
            const info = { "linkUrl": "https://bar.org/" };
            const expected = info.linkUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get from src", function () {
            const info = { "srcUrl": "http://baz.com/" };
            const expected = info.srcUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get from frame", function () {
            const info = { "frameUrl": "https://www.quz.fr/" };
            const expected = info.frameUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get from page", function () {
            const info = { "pageUrl": "https://addons.mozilla.org/fr/about" };
            const expected = info.pageUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get from popup", function () {
            const info = {
                "popupUrl": "https://developer.mozilla.org/fr/docs/Mozilla" +
                                  "/Add-ons/WebExtensions/user_interface/Popups"
            };
            const expected = info.popupUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should returns error from blank text", function () {
            const info = {
                "popupUrl": "     "
            };
            const expected = "noLink";
            return mux(info).then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            });
        });

        it("should get URL without protocol", function () {
            const info = {
                "selectionText": "www.youtube.com/watch?v=Di8uAwjidlQ"
            };
            const expected = "http://" + info.selectionText;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get magnet URL", function () {
            const info = {
                "linkUrl": "magnet:" +
                       "?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                         "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4"
            };
            const expected = info.linkUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });

        it("should get acestream URL", function () {
            const info = {
                "linkUrl": "acestream://0123456789abcdef"
            };
            const expected = info.linkUrl;
            return mux(info).then(function (url) {
                assert.strictEqual(url, expected);
            });
        });
    });

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
