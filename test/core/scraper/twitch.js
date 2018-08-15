import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/twitch", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://app.twitch.tv/download";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.twitch.tv/videos/*", function () {
        it("should return video id", function () {
            const url = "https://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://go.twitch.tv/videos/*", function () {
        it("should return video id", function () {
            const url = "https://go.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://go.twitch.tv/videos/164088111";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                          "&video_id=164088111";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://www.twitch.tv/*", function () {
        it("should return error when it's not a channel", function () {
            const url = "https://www.twitch.tv/directory";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });

        it("should return channel id", function () {
            const url = "https://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_id=86118798";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return channel id when protocol is HTTP", function () {
            const url = "http://www.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_id=86118798";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://go.twitch.tv/*", function () {
        it("should return error when it's not a channel", function () {
            const url = "https://go.twitch.tv/directory";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected),
                          `"${error.title}".includes(expected)`);
                assert.ok(error.message.includes(expected),
                          `"${error.message}".includes(expected)`);
            });
        });

        it("should return channel id", function () {
            const url = "https://go.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_id=86118798";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return channel id when protocol is HTTP", function () {
            const url = "http://go.twitch.tv/nolife";
            const expected = "plugin://plugin.video.twitch/?mode=play" +
                                                         "&channel_id=86118798";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
