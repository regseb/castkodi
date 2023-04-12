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

describe("Scraper: Instagram", function () {
    before(function () {
        // Désactiver les tests d'Instagram en dehors de la France car pour les
        // autres pays, il faut être connecté pour consulter les publications.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.instagram.com/p/6p_BDeK-8G/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://www.instagram.com/p/BpFwZ6JnYPq/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL when protocol is HTTP [opengraph]", async function () {
        const url = new URL("http://www.instagram.com/p/Bpji87LiJFs/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
