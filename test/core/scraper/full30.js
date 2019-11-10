import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/full30.js";

describe("scraper/full30", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.full30.com/recently-added";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.full30.com/video/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.full30.com/video/foobar";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "http://www.full30.com/video" +
                                            "/01c970fbc3cf59528c3daaa3a4020edb";
            const expected = "https://us.videos.epicio.net/bitmotive/public" +
                                         "/full30/v1.0/videos/demolitionranch" +
                                "/01c970fbc3cf59528c3daaa3a4020edb/854x480.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://www.full30.com/watch/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.full30.com/watch/foobar";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.full30.com/watch/MjY1" +
                                                      "/apple-devices-vs-50cal";
            const expected = "https://us.videos.epicio.net/bitmotive/public" +
                                         "/full30/v1.0/videos/demolitionranch" +
                                "/01c970fbc3cf59528c3daaa3a4020edb/854x480.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
