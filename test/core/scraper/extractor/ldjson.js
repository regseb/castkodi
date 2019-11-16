import assert     from "assert";
import { action } from "../../../../src/core/scraper/extractor/ldjson.js";

describe("scraper/extractor/ldjson", function () {
    describe("#action()", function () {
        it("should return null when there is not microdata", async function () {
            const url = "https://schema.org/";
            const expected = null;

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });

        it("should return null when JSON is invalid", async function () {
            const url = "https://dev.tube/@codingandrey";
            const expected = null;

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });

        it("should return contentUrl", async function () {
            const url = "http://www.jeuxvideo.com/videos/chroniques/1085775" +
                     "/pause-cafay-368-ea-enregistre-des-resultats-records.htm";
            const expected = "http://video1080.jeuxvideo.com/chroniques/p/a" +
                                 "/pause-cafay-368-973276-1564606712-1080p.mp4";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });

        it("should return contentUrl in children object", async function () {
            const url = "https://www.franceinter.fr/emissions/blockbusters" +
                                                "/blockbusters-19-juillet-2019";
            const expected = "https://media.radiofrance-podcast.net/podcast09" +
                                       "/17309-19.07.2019-ITEMA_22112050-0.mp3";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });
    });
});
