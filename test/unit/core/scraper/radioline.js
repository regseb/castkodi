import assert      from "assert";
import { extract } from "../../../../src/core/scraper/radioline.js";

describe("core/scraper/radioline.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "http://twitter.com/RadiolineFrance";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio", async function () {
            const url = "https://fr-fr.radioline.co/qui-sommes-nous";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not an audio with hash",
                                                             async function () {
            const url = "http://www.radioline.co" +
                                             "/search-result-for-radio-france" +
                                          "#radios/france-bleu-provence-666-fm";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL", async function () {
            const url = "http://www.radioline.co" +
                     "/podcast-france-inter-tanguy-pastureau-maltraite-l-info" +
                                                                   "#chapters" +
                             "/france-inter-tanguy-pastureau-maltraite-l-info" +
                                            ".gerald-darmanin-is-watching-you" +
                             "-20181112111300-767ff243e145d03dae436beee7e078a1";
            const expected = "http://rf.proxycast.org/1501861709009133568" +
                          "/18141-12.11.2018-ITEMA_21890205-0.mp3?_=1448798384";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return audio URL when protocol is HTTP", async function () {
            const url = "http://en-ie.radioline.co" +
                            "/podcast-france-inter-la-chronique-de-pablo-mira" +
                           "#chapters/france-inter-la-chronique-de-pablo-mira" +
                                                   ".ras-le-bol-du-ras-le-bol" +
                             "-20181114163800-3297da9989a66c1213ce5976c250f736";
            const expected = "http://rf.proxycast.org/1502668985731129344" +
                          "/16598-14.11.2018-ITEMA_21892402-0.mp3?_=1431848591";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
