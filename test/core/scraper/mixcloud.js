import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/mixcloud.js";

describe("scraper/mixcloud", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.mixcloud.com/upload/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.mixcloud.com/*/*/", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a music", function () {
            const url = "https://www.mixcloud.com/discover/jazz/";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id", function () {
            const url = "https://www.mixcloud.com" +
                                        "/LesGar%C3%A7onsBienElev%C3%A9s/n101/";
            const expected = "plugin://plugin.audio.mixcloud/" +
                              "?mode=40" +
                              "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s" +
                                   "%2Fn101%2F";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id when protocol is HTTP", function () {
            const url = "http://www.mixcloud.com" +
                                        "/LesGar%C3%A7onsBienElev%C3%A9s/n101/";
            const expected = "plugin://plugin.audio.mixcloud/" +
                              "?mode=40" +
                              "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s" +
                                   "%2Fn101%2F";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
