import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: podCloud", function () {
    it("should return audio URL", async function () {
        const url = new URL("https://podcloud.fr/podcast/le-cosy-corner" +
                                 "/episode/numero-51-sa-puissance-est-maximum");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://podcloud.fr/ext/le-cosy-corner" +
                           "/numero-51-sa-puissance-est-maximum/enclosure.mp3");
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = new URL("https://podcloud.fr/podcast/2-heures-de-perdues" +
                                                           "/episode/stargate");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://podcloud.fr/ext/2-heures-de-perdues" +
                                                     "/stargate/enclosure.mp3");
    });
});
