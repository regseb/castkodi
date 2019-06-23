import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/facebook.js";

describe("scraper/facebook", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.facebook.com/mozilla/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*.facebook.com/*/videos/*/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.facebook.com/XBMC/videos/666/";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id", function () {
            const url = "https://www.facebook.com/XBMC/videos" +
                                                          "/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.facebook.com/XBMC/videos" +
                                                          "/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when it's mobile version", function () {
            const url = "https://m.facebook.com/XBMC/videos/10152476888501641/";
            const expected = "/10840595_10152476888576641_527585110_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when it's a live", function () {
            const url = "https://www.facebook.com/foxcarolinanews/videos" +
                                                           "/2332364197043199/";
            const expected = "/10000000_1966311483496657" +
                                                  "_3292787323732754432_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });

    describe("*://*.facebook.com/watch*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when video doesn't exist", function () {
            const url = "https://www.facebook.com/watch/?v=666";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return null when it's not video", function () {
            const url = "https://www.facebook.com/watch/?x=315156812365737";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id", function () {
            const url = "https://www.facebook.com/watch/?v=315156812365737";
            const expected = "/40059842_458664621312657_6558162886282182656" +
                                                                      "_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.facebook.com/watch?v=315156812365737";
            const expected = "/40059842_458664621312657_6558162886282182656" +
                                                                      "_n.mp4?";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });
});
