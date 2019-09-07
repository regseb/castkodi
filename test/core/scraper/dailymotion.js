import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/dailymotion.js";

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
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return video id", function () {
            const url = "https://www.dailymotion.com/video/x17qw0a";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x17qw0a";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://dai.ly/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return tiny video id", function () {
            const url = "http://dai.ly/x5riqme";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x5riqme";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://www.dailymotion.com/embed/video/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return embed video id", function () {
            const url = "https://www.dailymotion.com/embed/video/a12bc3d";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=a12bc3d";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
