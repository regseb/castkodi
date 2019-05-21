import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/applepodcasts", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://podcasts.apple.com/us/artist/arte-radio" +
                                                                  "/1251092473";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://podcasts.apple.com/*/podcast/*/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://podcasts.apple.com/us/podcast/culture-1999/id";
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

        it("should return audio URL", function () {
            const url = "https://podcasts.apple.com/fr/podcast" +
                                "/cest-papy-mamie/id1093080425?i=1000435243113";
            const expected = "https://dts.podtrac.com/redirect.mp3" +
                                "/www.arteradio.com/podcast_sound/61661310.mp3";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
