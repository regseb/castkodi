/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Odysee", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://odysee.com/$/signin");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL [opengraph]", async function () {
        const url = new URL(
            "https://odysee.com/@informatique:4/Mediacenter-KODI:9",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://player.odycdn.com/api/v3/streams/free/Mediacenter-KODI" +
                "/95a3a486dcb31771ea4b43a1a2baed1e5bf3949f/784919.mp4",
        );
    });
});
