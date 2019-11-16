import assert           from "assert";
import { extract, mux } from "../../src/core/index.js";

describe("index", function () {
    describe("#mux()", function () {
        it("should ignore invalid input", function () {
            const urls = [
                undefined, "", " ", "www.foo.",
                "moz-extension://0123456789abdcef/index.html"
            ];
            const expected = undefined;

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should return URL", function () {
            const urls = ["https://www.foo.bar/"];
            const expected = "https://www.foo.bar/";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should return URL with protocol HTTP", function () {
            const urls = ["www.baz.fr/"];
            const expected = "http://www.baz.fr/";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should return magnet URL", function () {
            const urls = [
                "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                         "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4"
            ];
            const expected =
                "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                        "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should get acestream URL", function () {
            const urls = ["acestream://0123456789abcdef"];
            const expected = "acestream://0123456789abcdef";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });
    });

    describe("#extract()", function () {
        it("should support URL", async function () {
            const url = "http://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/";

            const file = await extract(url);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should support uppercase URL", async function () {
            const url = "HTTPS://VIMEO.COM/195613867";
            const expected = "plugin://plugin.video.vimeo/";

            const file = await extract(url);
            assert.ok(file.startsWith(expected),
                      `"${file}".startsWith(expected)`);
        });

        it("should support correctly question mark in pattern",
                                                             async function () {
            const url = "https://vid.ly/i2x4g5.mp4?quality=hd";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });

        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://kodi.tv/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("#rummage()", function () {
        it("should return the URL when it's not a page HTML",
                                                             async function () {
            const url = "https://kodi.tv/sites/default/themes/kodi/" +
                                                                 "logo-sbs.svg";
            const file = await extract(url);
            assert.strictEqual(file, url);
        });

        it("should return the MP3 URL", async function () {
            const url = "https://fr.wikipedia.org/wiki/awesome.MP3";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });

        it("should return the AVI URL", async function () {
            const url = "http://example.org/video.avi";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });

        it("should return Gamekult video URL", async function () {
            const url = "https://www.gamekult.com/emission" +
                        "/gautoz-fait-sa-moisson-de-pixels-a-l-evenement-inde" +
                                                             "-3050806583.html";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x6m0tlk";
            const file = await extract(url);
            assert.strictEqual(file, expected);
        });

        it("should return YT Home video URL", async function () {
            const url = "https://yt.ax/watch" +
                        "/how-to-make-perfect-chocolate-chip-cookies-40889071/";
            const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=rEdl2Uetpvo";

            const file = await extract(url);
            assert.strictEqual(file, expected);
        });

        it("should return TikTok video URL", async function () {
            const url = "https://www.tiktok.com/@the90guy/video" +
                                          "/6710341586984635654?langCountry=fr";
            const expected = "&lr=tiktok_m&qs=0&rc=ampvbHJwdnV4bjMzOjczM0ApPD" +
                             "M7OGU0aWU3NzM8aTY1PGc0azNhbmpja2NfLS0zMTZzczI1L" +
                                                  "zQyMF8yYV81X141LS06Yw%3D%3D";

            const file = await extract(url);
            assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
        });
    });
});
