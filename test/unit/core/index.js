import assert  from "assert";
import { mux } from "../../../src/core/index.js";

describe("core/index.js", function () {
    describe("mux()", function () {
        it("should ignore invalid input", function () {
            const urls = [
                undefined, "", " ", "www.foo.",
                "moz-extension://0123456789abdcef/index.html"
            ];
            const expected = undefined;

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should return URL", function () {
            const urls = ["https://www.foo.bar/"];
            const expected = "https://www.foo.bar/";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should return URL with protocol HTTP", function () {
            const urls = ["www.baz.fr/"];
            const expected = "http://www.baz.fr/";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should return magnet URL", function () {
            const urls = [
                "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                         "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4"
            ];
            const expected =
                "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                        "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });

        it("should get acestream URL", function () {
            const urls = ["acestream://0123456789abcdef"];
            const expected = "acestream://0123456789abcdef";

            const url = mux(urls);
            assert.strictEqual(url, expected);
        });
    });
});
