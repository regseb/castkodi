import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/airmozilla", function () {
    describe("#patterns", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.mozilla.org/fr/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://air.mozilla.org/*/", function () {
        it("should return error when it's not a video", function () {
            const url = "https://air.mozilla.org/about/";
            const expected = "novideo";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return WebM HD video url", function () {
            browser.storage.local.set({ "airmozilla-format": "hd_webm" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video" +
                                                  "&format=hd_webm";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return WebM video url", function () {
            browser.storage.local.set({ "airmozilla-format": "webm" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video&format=webm";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return MP4 HD video url", function () {
            browser.storage.local.set({ "airmozilla-format": "hd_mp4" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video" +
                                                  "&format=hd_mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return MP4 video url", function () {
            browser.storage.local.set({ "airmozilla-format": "mp4" });

            const url = "https://air.mozilla.org/add-ons-community-meeting/";
            const expected = "https://vid.ly/i2x4g5?content=video&format=mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
