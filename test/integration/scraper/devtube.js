/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: DevTube", function () {
    it("should return video id", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://dev.tube/video/4rWypxBwrR4");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=4rWypxBwrR4&incognito=false",
        );
    });
});
