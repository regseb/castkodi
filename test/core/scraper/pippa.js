import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/pippa", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://shows.pippa.io/studio-404";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("https://shows.pippa.io/*/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://shows.pippa.io/studio-404/";
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

        it("should return sound URL", function () {
            const url = "https://shows.pippa.io/studio-404" +
                                                 "/studio-404-65-novembre-2018";
            const expected = "https://app.pippa.io/public/streams" +
                                          "/59ee5fc85d6ff59869bbeb01/episodes" +
                                   "/5bfc6eae690503213d3db1ac.mp3?ref=facebook";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://shows.pippa.io/studio-404" +
                           "/studio-404-64-octobre-2018-studio-404-x-surfrider";
            const expected = "https://app.pippa.io/public/streams" +
                                          "/59ee5fc85d6ff59869bbeb01/episodes" +
                                   "/5bc3af025840c11d736078eb.mp3?ref=facebook";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
