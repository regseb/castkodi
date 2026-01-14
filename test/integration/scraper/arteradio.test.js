/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Arte Radio", () => {
    it("should return audio URL", async () => {
        const url = new URL("https://www.arteradio.com/son/fais_moi_ouir");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdn.arteradio.com/permanent/arteradio/sites/default" +
                "/files/sons/01faismoiouir_hq_fr.mp3",
        );
    });
});
