/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Kick", function () {
    it("should return undefined with home page", async function () {
        const url = new URL("https://kick.com/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined with legal page", async function () {
        const url = new URL("https://kick.com/dmca-policy");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return undefined when it isn't a live", async function () {
        const url = new URL("https://kick.com/categories");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return live URL", async function () {
        // Récupérer l'URL d'un live dans la page Parcourir.
        const response = await fetch("https://kick.com/browse");
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const a = /** @type {HTMLAnchorElement} */ (
            doc.querySelector(
                'a:has(img[src^="https://files.kick.com/images/user/"])',
            )
        );

        const url = new URL(a.getAttribute("href"), "https://kick.com/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".m3u8"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
