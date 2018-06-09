import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/dailymotion", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "http://www.dailymotion.com/fr/feed";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.dailymotion.com/video/*", function () {
        it("should return video id", function () {
            const url = "https://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x17qw0a";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://dai.ly/*", function () {
        it("should return tiny video id", function () {
            const url = "http://dai.ly/x5riqme";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=x5riqme";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://www.dailymotion.com/embed/video/*", function () {
        it("should return embed video id", function () {
            const url = "https://www.dailymotion.com/embed/video/a12bc3d";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                             "?mode=playVideo" +
                                                             "&url=a12bc3d";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
