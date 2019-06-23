import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
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
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.stormo.tv/videos/foo";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.stormo.tv/videos/338790" +
                                                       "/tancuyushchaya-zebra/";
            const expected = "https://www.stormo.tv/get_file/22" +
                                 "/34e334698d06ca878d9842e10fe834340b0ea7f0fc" +
                                                   "/338000/338790/338790.mp4/";
            return action(new URL(url)).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
