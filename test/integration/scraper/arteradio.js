/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Arte Radio", function () {
    it("should return audio URL", async function () {
        const url = new URL("https://www.arteradio.com/son/fais_moi_ouir");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdn.arteradio.com/permanent/arteradio/sites/default" +
                "/files/sons/01faismoiouir_hq_fr.mp3",
        );
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = new URL("http://www.arteradio.com/son/fais_moi_ouir");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdn.arteradio.com/permanent/arteradio/sites/default" +
                "/files/sons/01faismoiouir_hq_fr.mp3",
        );
    });
});
