import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/vimeo.js";

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
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://vimeo.com/channels";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id", function () {
            const url = "https://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://vimeo.com/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://player.vimeo.com/video/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://player.vimeo.com/video/foobar";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id", function () {
            const url = "https://player.vimeo.com/video/228786490";
            const expected = "plugin://plugin.video.vimeo/play/" +
                                                          "?video_id=228786490";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
