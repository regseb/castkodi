import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Útvarp Saga", function () {
    it("should return video URL [audio]", async function () {
        const url = new URL("https://www.utvarpsaga.is/snjallsimarnir-eru" +
                                              "-farnir-ad-stjorna-lifi-folks/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://www.utvarpsaga.is/file/" +
                "s%C3%AD%C3%B0degi-a-7.9.18.mp3?_=1");
    });

    it("should return video URL without 'www' [audio]", async function () {
        const url = new URL("https://utvarpsaga.is/samfelagsmidlar-mynda" +
                                     "-nuning-milli-hopa-med-olikar-skodanir/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://www.utvarpsaga.is/file/" +
                "vi%C3%B0tal-%C3%ADva-mar%C3%ADn-24.09.20.mp3");
    });
});
