/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";
import "../setup.js";

describe("Scraper: BitChute [fr]", () => {
    before((t) => {
        // Désactiver les tests de BitChute en dehors de la France, car ça ne
        // fonctionne pas dans les autres pays.
        if (undefined !== config.country && "fr" !== config.country) {
            t.skip();
        }
    });

    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://www.bitchute.com/category/science/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        // Comparer avec une URL, car les propriétés Open Graph de la page sont
        // boguées : elles sont présentes (elles sont surement ajoutées
        // automatiquement en préfixant les URL par
        // "https://www.bitchute.com/embed/"),
        assert.equal(file, "https://www.bitchute.com/embed//category/science/");
    });

    it("should return video URL", async () => {
        const url = new URL("https://www.bitchute.com/video/dz5JcCZnJMge");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith(".bitchute.com/hU2elaB5u3kB/dz5JcCZnJMge.mp4"),
            `"${file}"?.endsWith(...)`,
        );
    });
});
