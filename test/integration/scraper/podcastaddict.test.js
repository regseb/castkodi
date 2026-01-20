/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Podcast Addict", () => {
    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://podcastaddict.com/app");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    // Désactiver ce test, car le site a un challenge qui détecte Node.js.
    // "Enable JavaScript and cookies to continue"
    it.skip("should return audio URL [media]", async () => {
        const url = new URL(
            "https://podcastaddict.com/silence-on-joue/episode/141591598",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://sphinx.acast.com/p/open/s/5b7ac427c6a58e726f576cff/e" +
                "/62b5812411883600129b5886/media.mp3",
        );
    });
});
