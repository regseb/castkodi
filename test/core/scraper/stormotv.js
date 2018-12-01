import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

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
        it("should return error when it's not a video", function () {
            const url = "https://www.stormo.tv/videos/foo";
            const expected = "noVideo";
            return extract(url).then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.ok(err.title.includes(expected),
                          `"${err.title}".includes(expected)`);
                assert.ok(err.message.includes(expected),
                          `"${err.message}".includes(expected)`);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.stormo.tv/videos/338790" +
                                                       "/tancuyushchaya-zebra/";
            const expected = "https://www.stormo.tv/get_file/17" +
                                            "/34e334698d06ca878d9842e10fe83434";
            return extract(url).then(function (file) {
                assert.ok(file.startsWith(expected),
                          `"${file}".startsWith(expected)`);
            });
        });
    });
});
