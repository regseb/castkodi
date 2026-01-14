/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Mastodon", () => {
    it("should return video URL [opengraph]", async () => {
        const url = new URL("https://mamot.fr/@davduf/112586386594480705");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://static.mamot.fr/media_attachments/files/112/586/378/979" +
                "/928/374/original/a5230271b22e9032.mp4",
        );
    });
});
