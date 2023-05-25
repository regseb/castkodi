/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: ZDF", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.zdf.de/filme");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.zdf.de/dokumentation/37-grad" +
                "/37-im-schuldenstrudel-100.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://nrodlzdf-a.akamaihd.net/none/zdf/21/04" +
                "/210427_sendung_37g/4" +
                "/210427_sendung_37g_a1a2_2128k_p18v15.webm",
        );
    });
});
