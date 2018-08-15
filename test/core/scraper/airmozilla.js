import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/airmozilla", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.mozilla.org/fr/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://air.mozilla.org/*/", function () {
        it("should return error when it's not a video", function () {
            const url = "https://air.mozilla.org/about/";
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

        it("should return WebM HD video URL", function () {
            browser.storage.local.set({ "airmozilla-format": "hd_webm" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video" +
                                                  "&format=hd_webm";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return WebM video URL", function () {
            browser.storage.local.set({ "airmozilla-format": "webm" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video&format=webm";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return MP4 HD video URL", function () {
            browser.storage.local.set({ "airmozilla-format": "hd_mp4" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video" +
                                                  "&format=hd_mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return MP4 video URL", function () {
            browser.storage.local.set({ "airmozilla-format": "mp4" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video&format=mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });

        it("should return video URL when protocol is HTTP", function () {
            browser.storage.local.set({ "airmozilla-format": "webm" });

            const url = "http://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video&format=webm";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);

                browser.storage.local.clear();
            });
        });
    });
});
