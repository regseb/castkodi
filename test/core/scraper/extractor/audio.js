import assert     from "assert";
import { action } from "../../../../src/core/scraper/extractor/audio.js";

describe("scraper/extractor/audio", function () {
    describe("#action()", function () {
        it("should return null when there is not audio", async function () {
            const url = "https://en.wikipedia.org/wiki/HTML5_audio";
            const expected = null;

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });

        it("should return Útvarp Saga URL", async function () {
            const url = "https://utvarpsaga.is/" +
                             "snjallsimarnir-eru-farnir-ad-stjorna-lifi-folks/";
            const expected = "https://www.utvarpsaga.is/file/" +
                                           "s%C3%AD%C3%B0degi-a-7.9.18.mp3?_=1";

            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, "text/html");

            const file = action(doc);
            assert.strictEqual(file, expected);
        });
    });
});
