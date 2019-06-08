import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/mycloudplayers", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "http://mycloudplayer.com/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://mycloudplayers.com/*", function () {
        it("should return error when it's not a music", function () {
            const url = "https://mycloudplayers.com/?featured=tracks";
            const expected = "noAudio";
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

        it("should return music id", function () {
            const url = "https://mycloudplayers.com/?play=176387011";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id when protocol is HTTP", function () {
            const url = "http://mycloudplayers.com/?play=176387011";
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
