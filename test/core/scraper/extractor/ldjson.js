import assert     from "assert";
import { action } from "../../../../src/core/scraper/extractor/ldjson.js";

describe("scraper/extractor/ldjson", function () {
    describe("#action()", function () {
        it("should return null when there is not microdata", function () {
            const url = "https://schema.org/";
            const expected = null;
            return fetch(url).then((r) => r.text())
                             .then((data) => {
                const doc = new DOMParser().parseFromString(data, "text/html");

                const file = action(doc);
                assert.strictEqual(file, expected);
            });
        });

        it("should return null when JSON is invalid", function () {
            const url = "https://dev.tube/@codingandrey";
            const expected = null;
            return fetch(url).then((r) => r.text())
                             .then((data) => {
                const doc = new DOMParser().parseFromString(data, "text/html");

                const file = action(doc);
                assert.strictEqual(file, expected);
            });
        });

        it("should return contentUrl", function () {
            const url = "http://www.jeuxvideo.com/videos/chroniques/1085775" +
                     "/pause-cafay-368-ea-enregistre-des-resultats-records.htm";
            const expected = "http://video1080.jeuxvideo.com/chroniques/p/a" +
                                 "/pause-cafay-368-973276-1564606712-1080p.mp4";
            return fetch(url).then((r) => r.text())
                             .then((data) => {
                const doc = new DOMParser().parseFromString(data, "text/html");

                const file = action(doc);
                assert.strictEqual(file, expected);
            });
        });

        it("should return contentUrl in children object", function () {
            const url = "https://www.franceinter.fr/emissions/blockbusters" +
                                                "/blockbusters-19-juillet-2019";
            const expected = "https://media.radiofrance-podcast.net/podcast09" +
                                       "/17309-19.07.2019-ITEMA_22112050-0.mp3";
            return fetch(url).then((r) => r.text())
                             .then((data) => {
                const doc = new DOMParser().parseFromString(data, "text/html");

                const file = action(doc);
                assert.strictEqual(file, expected);
            });
        });
    });
});
