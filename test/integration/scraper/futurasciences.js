/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Futura Sciences", function () {
    it("should return page undefined when there isn't video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.futura-sciences.com/tech/telecharger/kodi-287",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined URL when it's a image", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.futura-sciences.com/favicon-16x16.png",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL from iframe", async function () {
        const url = new URL(
            "https://www.futura-sciences.com/sciences/actualites" +
                "/acces-espace-video-decollage-atterrissage-reussi-prototype" +
                "-starship-spacex-80782/",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://v.kolplay.com/XLJomogr83J/index.m3u8");
    });

    it("should return video URL from vsly-player", async function () {
        const url = new URL(
            "https://www.futura-sciences.com/sciences/videos" +
                "/jupiter-devoilee-sonde-juno-5580/",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://v.kolplay.com/3ZSdTrtt4G5/index.m3u8");
    });
});
