import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Arte Radio", function () {
    it("should return audio URL", async function () {
        const url = "https://www.arteradio.com/son/61657661/fais_moi_ouir";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://download.www.arte.tv/permanent/arteradio" +
                           "/sites/default/files/sons/01faismoiouir_hq_fr.mp3");
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = "http://www.arteradio.com/son/61657661/fais_moi_ouir";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://download.www.arte.tv/permanent/arteradio" +
                           "/sites/default/files/sons/01faismoiouir_hq_fr.mp3");
    });
});
