import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Viously", function () {
    it("should return video URL from export", async function () {
        const url = new URL("https://www.viously.com/export/doDeMzbVkpr" +
                                                          "?wmode=transparent");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://v.kolplay.com/doDeMzbVkpr/index.m3u8");
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://www.viously.com/export/doDeMzbVkpr" +
                                                          "?wmode=transparent");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://v.kolplay.com/doDeMzbVkpr/index.m3u8");
    });

    it("should return video URL from amp", async function () {
        const url = new URL("https://www.viously.com/amp/3ZSdTrtt4G5");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://v.kolplay.com/3ZSdTrtt4G5/index.m3u8");
    });
});
