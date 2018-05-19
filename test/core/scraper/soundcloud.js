import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/soundcloud", function () {
    describe("#patterns", function () {
        it("should return error when it's not a music", function () {
            const url = "https://soundcloud.com/stream";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://soundcloud.com/*", function () {
        it("should return error when it's not a music", function () {
            const url = "https://soundcloud.com/a-tribe-called-red/" +
                                                             "sets/trapline-ep";
            const expected = "noaudio";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return error when it's not a music", function () {
            const url = "https://soundcloud.com/you/collection";
            const expected = "noaudio";
            return extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return music id", function () {
            const url = "https://soundcloud.com/esa/a-singing-comet";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id", function () {
            const url = "https://mobi.soundcloud.com/" +
                                     "a-tribe-called-red/electric-pow-wow-drum";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                            "?audio_id=8481452";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
