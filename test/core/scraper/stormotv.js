import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/stormotv.js";

describe("scraper/stormotv", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.stormo.tv/categories/sport/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://www.stormo.tv/videos/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.stormo.tv/videos/foo";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.stormo.tv/videos/514985" +
                                             "/little-big-rock-paper-scissors/";
            const expected = "/514000/514985/514985_low.mp4/";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.endsWith(expected),
                          `"${file}".endsWith(expected)`);
            });
        });
    });
});
