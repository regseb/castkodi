import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/scrapers.js";
import { rules }   from "../../../src/core/scraper/jeuxvideocom.js";

describe("scraper/jeuxvideocom", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "http://www.jeuxvideo.fr/";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.jeuxvideo.com/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "http://www.jeuxvideo.com/videos-de-jeux.htm";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL from videos-editors page", function () {
            const url = "http://www.jeuxvideo.com/videos-editeurs/0000" +
                                "/00007335/half-life-2-pc-trailer-00004956.htm";
            const expected = "http://videohd.jeuxvideo.com/videos_editeurs" +
                                                      "/0000/00004956-high.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL from extracts-videos page", function () {
            const url = "http://www.jeuxvideo.com/extraits-videos-jeux/0002" +
                             "/00023827/portal-2-pc-meet-wheatley-00008311.htm";
            const expected = "http://videohd.jeuxvideo.com/extraits/201104" +
                                               "/portal_2_pc-00008311-high.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://jeuxvideo.com/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video URL", function () {
            const url = "http://www.jeuxvideo.com/videos/461728" +
                 "/superhot-notre-avis-en-deux-minutes-sur-ce-fps-original.htm";
            const expected = "http://videohd.jeuxvideo.com/news/v/t" +
                                       "/vtsuperhot-259342-1457111085-high.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
