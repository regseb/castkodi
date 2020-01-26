import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: podCloud", function () {
    it("should return audio URL", async function () {
        const url = "https://podcloud.fr/podcast/le-cosy-corner/episode" +
                                          "/numero-51-sa-puissance-est-maximum";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://podcloud.fr/ext/le-cosy-corner" +
                            "/numero-51-sa-puissance-est-maximum/enclosure.mp3";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = "https://podcloud.fr/podcast/2-heures-de-perdues" +
                                                            "/episode/stargate";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://podcloud.fr/ext/2-heures-de-perdues" +
                                                      "/stargate/enclosure.mp3";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
