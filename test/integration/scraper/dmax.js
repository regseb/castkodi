/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: DMAX", function () {
    before(function () {
        if (undefined !== config.country && "de" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://dmax.de/sendungen/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL from asset", async function () {
        const url = new URL(
            "https://dmax.de/sendungen" +
                "/blind-frog-ranch-die-schatzsucher-von-utah/antworten/",
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

    it("should return video URL from show", async function () {
        const url = new URL("https://dmax.de/sendungen/fast-n-loud/");
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
