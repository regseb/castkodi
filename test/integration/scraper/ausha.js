/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Ausha", function () {
    it("should return undefined when it isn't an audio", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://podcast.ausha.co/dont/exist");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return audio URL", async function () {
        const url = new URL(
            "https://podcast.ausha.co/firstprintfra/fp-aout-2022-1",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, "https://audio.ausha.co/b3RDWTvLDnEK.mp3");
    });
});
