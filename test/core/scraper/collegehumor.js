import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/collegehumor", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "http://www.collegehumor.com/videos";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.collegehumor.com/video/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.collegehumor.com/video/lorem/ipsum";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return video id", function () {
            const url = "https://www.collegehumor.com/video/6947898/" +
                                                              "google-is-a-guy";
            const expected = "plugin://plugin.video.collegehumor/watch/" +
                                                                      "6947898";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.collegehumor.com/video/6947898/" +
                                                              "google-is-a-guy";
            const expected = "plugin://plugin.video.collegehumor/watch/" +
                                                                      "6947898";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
