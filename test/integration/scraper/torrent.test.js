/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: torrent", () => {
    it("should return video URL from torrent", async () => {
        const url = new URL(
            "https://archive.org/download/Sintel/Sintel_archive.torrent",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.elementum/play" +
                "?uri=https%3A%2F%2Farchive.org%2Fdownload%2FSintel" +
                "%2FSintel_archive.torrent",
        );
    });
});
