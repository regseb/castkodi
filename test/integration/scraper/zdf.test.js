/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: ZDF", () => {
    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://www.zdf.de/filme");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async () => {
        const url = new URL(
            "https://www.zdf.de/play/dokus/auslandsjournal-die-doku-130" +
                "/auslandsjournal---die-doku-auf-der-suche-nach-dolce-vita" +
                "-vom-22-oktober-2026-102",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://nrodlzdf-a.akamaihd.net/none/zdf/26/10" +
                "/261021_doku_dolce_vita_ajo/1" +
                "/261021_doku_dolce_vita_ajo_4328k_p19v17.webm",
        );
    });
});
