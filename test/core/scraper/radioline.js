import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("scraper/radioline", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL", function () {
            const url = "http://twitter.com/RadiolineFrance";
            return extract(url).then(function (file) {
                assert.strictEqual(file, url);
            });
        });
    });

    describe("*://*.radioline.co/*", function () {
        it("should return error when it's not a music", function () {
            const url = "https://fr-fr.radioline.co/qui-sommes-nous";
            const expected = "noAudio";
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

        it("should return error when it's not a music", function () {
            const url = "http://www.radioline.co/" +
                                              "search-result-for-radio-france" +
                                          "#radios/france-bleu-provence-666-fm";
            const expected = "noAudio";
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

        it("should return music id", function () {
            const url = "http://www.radioline.co" +
                     "/podcast-france-inter-tanguy-pastureau-maltraite-l-info" +
                                                                   "#chapters" +
                             "/france-inter-tanguy-pastureau-maltraite-l-info" +
                                            ".gerald-darmanin-is-watching-you" +
                             "-20181112111300-767ff243e145d03dae436beee7e078a1";
            const expected = "http://rf.proxycast.org/1501861709009133568" +
                          "/18141-12.11.2018-ITEMA_21890205-0.mp3?_=1448798384";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });

        it("should return music id when protocol is HTTP", function () {
            const url = "http://en-ie.radioline.co" +
                            "/podcast-france-inter-la-chronique-de-pablo-mira" +
                           "#chapters/france-inter-la-chronique-de-pablo-mira" +
                                                   ".ras-le-bol-du-ras-le-bol" +
                             "-20181114163800-3297da9989a66c1213ce5976c250f736";
            const expected = "http://rf.proxycast.org/1502668985731129344" +
                          "/16598-14.11.2018-ITEMA_21892402-0.mp3?_=1431848591";
            return extract(url).then(function (file) {
                assert.strictEqual(file, expected);
            });
        });
    });
});
