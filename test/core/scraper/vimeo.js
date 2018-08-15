import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/vimeo", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://developer.vimeo.com/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://vimeo.com/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://vimeo.com/channels";
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

        it("should return video id", function () {
            const url = "https://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://player.vimeo.com/video/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://player.vimeo.com/video/foobar";
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

        it("should return video id", function () {
            const url = "https://player.vimeo.com/video/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
