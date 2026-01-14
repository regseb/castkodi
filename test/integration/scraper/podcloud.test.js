/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: podCloud", () => {
    it("should return audio URL", async () => {
        const url = new URL(
            "https://podcloud.fr/podcast/le-cosy-corner/episode" +
                "/numero-51-sa-puissance-est-maximum",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://podcloud.fr/ext/le-cosy-corner" +
                "/numero-51-sa-puissance-est-maximum/enclosure.mp3",
        );
    });
});
