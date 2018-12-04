import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/allocine", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://secure.allocine.fr/account";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("http://www.allocine.fr/*", function () {
        it("should return error when it's not a video", function () {
            const url = "http://www.allocine.fr/video/";
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
            const url = "http://www.allocine.fr/video/video-19577157/";
            const expected = "http://fr.vid.web.acsta.net/nmedia/33/18/02/23" +
                                                      "/15/19577157_hd_013.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL SD", function () {
            const url = "http://www.allocine.fr/video" +
                                  "/player_gen_cmedia=19432206&cfilm=1051.html";
            const expected = "http://s3.vid.web.acsta.net/FR/nmedia/33/18/66" +
                                                   "/14/37/19432206_sd_013.mp4";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
