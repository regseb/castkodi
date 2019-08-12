import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/applepodcasts.js";

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

    describe("https://podcasts.apple.com/*/podcast/*/id*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return null when it's not a video", function () {
            const url = "https://podcasts.apple.com/us/podcast/culture-1999/id";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return audio URL", function () {
            const url = "https://podcasts.apple.com/fr/podcast" +
                                "/cest-papy-mamie/id1093080425?i=1000435243113";
            const expected = "https://dts.podtrac.com/redirect.mp3" +
                                "/www.arteradio.com/podcast_sound/61661310.mp3";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
