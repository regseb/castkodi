import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/onetv.js";

describe("scraper/onetv", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "https://www.1tv.ru/schedule/week";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://www.1tv.ru/shows/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.1tv.ru/shows/kvn";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.1tv.ru/shows/pozner/izbrannoe" +
                    "/razvlech-publiku-lozhyu-slozhno-maksim-galkin-o-svobode" +
                    "-yumora-pozner-fragment-vypuska-ot-03-06-2019";
            const expected = "https://balancer-vod.1tv.ru/video/multibitrate" +
                      "/video/2019/06/03/0535f134-80c9-40f2-af3b-6bb485488fe8" +
                      "_20190604_Pozner_High_950.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL when protocol is HTTP", function () {
            const url = "http://www.1tv.ru/shows/zdorove/vypuski" +
                                                "/zdorove-vypusk-ot-26-05-2019";
            const expected = "https://balancer-vod.1tv.ru/video/multibitrate" +
                      "/video/2019/05/26/0bcc8f80-6082-4589-85b1-fcc000e150e9" +
                             "_HD-news-2019_05_26-08_19_35_2923421_cut_950.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });

    describe("*://www.1tv.ru/movies/*", function () {
        let action;
        before(function () {
            action = Array.from(rules.entries())
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", function () {
            const url = "https://www.1tv.ru/movies/vse-filmy";
            const expected = null;
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return video URL", function () {
            const url = "https://www.1tv.ru/movies/angel-hranitel" +
                                                 "/angel-hranitel-9-i-10-serii";
            const expected = "https://balancer-vod.1tv.ru/video/multibitrate" +
                                                           "/video/2019/06/24" +
                                       "/addedf12-ad63-491d-8c8e-ffe24aa6e981" +
                                         "_HD-news-2019_06_24-19_44_32_950.mp4";
            return action(new URL(url)).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
