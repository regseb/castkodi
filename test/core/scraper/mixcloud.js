import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

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
        it("should return error when it's not a music", function () {
            const url = "https://www.mixcloud.com/discover/jazz/";
            const expected = "noAudio";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return music id", function () {
            const url = "https://www.mixcloud.com" +
                                        "/LesGar%C3%A7onsBienElev%C3%A9s/n101/";
            const expected = "plugin://plugin.audio.mixcloud/" +
                              "?mode=40" +
                              "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s" +
                                   "%2Fn101%2F";
            return extract(url).then(function (file) {
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
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
