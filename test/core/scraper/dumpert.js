import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/dumpert.js";

describe("scraper/dumpert", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "http://www.dumpert.nl/toppers/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.dumpert.nl/mediabase/*", function () {
        let action;
        before(function () {
            action = rules.get(this.test.parent.title);
        });

        it("should return video URL", function () {
            const url = "https://www.dumpert.nl/mediabase/7248279" +
                                                 "/47066e59/wheelie_in_ny.html";
            const expected = "plugin://plugin.video.dumpert/?action=play" +
                                "&video_page_url=https%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                        "%2Fwheelie_in_ny.html";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL when protocol is HTTP", function () {
            const url = "http://www.dumpert.nl/mediabase/7248279" +
                                                 "/47066e59/wheelie_in_ny.html";
            const expected = "plugin://plugin.video.dumpert/?action=play" +
                                 "&video_page_url=http%3A%2F%2Fwww.dumpert.nl" +
                                           "%2Fmediabase%2F7248279%2F47066e59" +
                                                        "%2Fwheelie_in_ny.html";

            const file = action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
