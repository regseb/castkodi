import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

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
        it("should return error when it's not a video", function () {
            const url = "http://www.jeuxvideo.com/videos-de-jeux.htm";
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

        it("should return video URL", function () {
            const url = "http://www.jeuxvideo.com/videos-editeurs/0000/" +
                                 "00007335/half-life-2-pc-trailer-00004956.htm";
            const expected = "http://videohd.jeuxvideo.com/videos_editeurs/" +
                                                       "0000/00004956-high.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "http://www.jeuxvideo.com/extraits-videos-jeux/0002/" +
                              "00023827/portal-2-pc-meet-wheatley-00008311.htm";
            const expected = "http://videohd.jeuxvideo.com/extraits/201104/" +
                                                "portal_2_pc-00008311-high.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
