/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VideosHub", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://videoshub.com/videos/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    // Désactiver ce test car VideosHub est temporairement indisponible ("503
    // Service Temporarily Unavailable").
    it.skip("should return video URL", async function () {
        const url = new URL("https://videoshub.com/videos/25310930");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://dd5tb0cfadhae.cloudfront.net/59665_360p.m3u8",
        );
    });
});
