/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: France tv", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.france.tv/spectacles-et-culture/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.france.tv/france-3/des-racines-et-des-ailes" +
                "/316863-les-imprenables-forteresses-cathares-queribus-et" +
                "-peyrepertuse.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                new URL(file).pathname.endsWith("/manifest.mpd"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
