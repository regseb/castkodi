import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/full30", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.full30.com/recently-added";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.full30.com/videos/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.full30.com/video/foo";
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

        it("should return video URL", function () {
            const url = "https://www.full30.com/video/" +
                                             "01c970fbc3cf59528c3daaa3a4020edb";
            const expected = "https://videos.full30.com/bitmotive/public/" +
                                         "full30/v1.0/videos/demolitionranch/" +
                                 "01c970fbc3cf59528c3daaa3a4020edb/640x360.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
