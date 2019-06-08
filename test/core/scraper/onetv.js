import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

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
        it("should return error when it's not a video", function () {
            const url = "https://www.1tv.ru/shows/kvn";
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

        it("should return video id", function () {
            const url = "https://www.1tv.ru/shows/pozner/izbrannoe" +
                    "/razvlech-publiku-lozhyu-slozhno-maksim-galkin-o-svobode" +
                    "-yumora-pozner-fragment-vypuska-ot-03-06-2019";
            const expected = "https://redirect.1tv.ru/video/multibitrate" +
                      "/video/2019/06/03/0535f134-80c9-40f2-af3b-6bb485488fe8" +
                      "_20190604_Pozner_High_950.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "http://www.1tv.ru/shows/zdorove/vypuski" +
                                                "/zdorove-vypusk-ot-26-05-2019";
            const expected = "https://redirect.1tv.ru/video/multibitrate" +
                      "/video/2019/05/26/0bcc8f80-6082-4589-85b1-fcc000e150e9" +
                             "_HD-news-2019_05_26-08_19_35_2923421_cut_950.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });

    describe("*://www.1tv.ru/movies/*", function () {
        it("should return error when it's not a video", function () {
            const url = "https://www.1tv.ru/movies/vse-filmy";
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

        it("should return video id", function () {
            const url = "https://www.1tv.ru/movies/svadby-i-razvody" +
                                                "/svadby-i-razvody-1-i-2-serii";
            const expected = "https://redirect.1tv.ru/video/multibitrate" +
                      "/video/2019/06/03/b602bc15-e3ae-4760-9d18-bb31d7053fdc" +
                                         "_HD-news-2019_06_03-19_39_43_950.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });

        it("should return video id when protocol is HTTP", function () {
            const url = "https://www.1tv.ru/movies/petlya-nesterova" +
                                                "/petlya-nesterova-1-i-2-serii";
            const expected = "https://redirect.1tv.ru/video/multibitrate" +
                      "/video/2019/05/28/ae50aac2-30d9-4424-bd39-a70692c95ec6" +
                                         "_HD-news-2019_06_03-23_26_12_950.mp4";
            return extract(url).then(function (file) {
                assert.ok(file.includes(expected),
                          `"${file}".includes(expected)`);
            });
        });
    });
});
