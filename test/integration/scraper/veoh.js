/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Veoh", function () {
    it("should return undefined when there isn't video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.veoh.com/watch/v52936940QEbxjapF");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return undefined when page doesn't exist", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.veoh.com/watch/A1b2C3");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.veoh.com/watch/v141918964qPaACxYC");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            file?.startsWith(
                "https://redirect.veoh.com/flash/p/2/v141918964qPaACxYC" +
                    "/h141918964.mp4",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });
});
