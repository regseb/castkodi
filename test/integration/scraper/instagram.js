/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Instagram [fr]", function () {
    before(function () {
        // Désactiver les tests d'Instagram en dehors de la France, car il faut
        // être connecté pour consulter les publications dans les autres pays.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.instagram.com/p/6p_BDeK-8G/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://www.instagram.com/p/BpFwZ6JnYPq/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL when protocol is HTTP [opengraph]", async function () {
        const url = new URL("http://www.instagram.com/p/Bpji87LiJFs/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
