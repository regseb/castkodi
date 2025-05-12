/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

// Désactiver les tests, car Podcast Addict détecte que la requête provient d'un
// robot et il refuse d'afficher la page : "Enable JavaScript and cookies to
// continue".
describe.skip("Scraper: Podcast Addict", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://podcastaddict.com/app");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL [media]", async function () {
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
