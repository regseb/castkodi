import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/facebook", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.facebook.com/mozilla/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.facebook.com/*/videos/*/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.facebook.com/XBMC/videos/666/";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.ok(err.title.includes(expected),
                          `"${err.title}".includes(expected)`);
                assert.ok(err.message.includes(expected),
                          `"${err.message}".includes(expected)`);
            });
        });

        it("should return video id", function () {
            const url = "https://www.facebook.com/XBMC/videos" +
                                                          "/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.facebook.com/XBMC/videos" +
                                                          "/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });

    describe("*://www.facebook.com/watch*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.facebook.com/watch/?v=666";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.ok(err.title.includes(expected),
                          `"${err.title}".includes(expected)`);
                assert.ok(err.message.includes(expected),
                          `"${err.message}".includes(expected)`);
            });
        });

        it("should return video id", function () {
            const url = "https://www.facebook.com/watch/?v=315156812365737";
            const expected = "/40059842_458664621312657_6558162886282182656" +
                                                                      "_n.mp4?";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.facebook.com/watch/?v=315156812365737";
            const expected = "/40059842_458664621312657_6558162886282182656" +
                                                                      "_n.mp4?";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });
});
