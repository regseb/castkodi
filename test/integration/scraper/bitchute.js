/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: BitChute", function () {
    before(function () {
        // Désactiver les tests de BitChute en dehors de la France car pour les
        // autres pays, ce ne fonctionne pas.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.bitchute.com/category/science/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL [video]", async function () {
        const url = new URL("https://www.bitchute.com/video/dz5JcCZnJMge/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            file?.endsWith(".bitchute.com/hU2elaB5u3kB/dz5JcCZnJMge.mp4"),
            `"${file}"?.endsWith(...)`,
        );
    });
});
