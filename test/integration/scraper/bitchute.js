/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: BitChute [fr]", function () {
    before(function () {
        // Désactiver les tests de BitChute en dehors de la France, car ça ne
        // fonctionne pas dans les autres pays.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.bitchute.com/category/science/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [video]", async function () {
        const url = new URL("https://www.bitchute.com/video/dz5JcCZnJMge/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith(".bitchute.com/hU2elaB5u3kB/dz5JcCZnJMge.mp4"),
            `"${file}"?.endsWith(...)`,
        );
    });
});
