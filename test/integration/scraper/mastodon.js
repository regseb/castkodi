/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Mastodon", function () {
    it("should return video URL [opengraph]", async function () {
        const url = new URL(
            "https://mastodon.social/@Mi_NumEco_Gouv/108469304023929478",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://files.mastodon.social/media_attachments/files/108/469" +
                "/303/433/550/677/original/811ce06c46f6638f.mp4",
        );
    });
});
