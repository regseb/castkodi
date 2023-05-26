/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Invidious", function () {
    it("should return video id [youtube]", async function () {
        browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://invidio.us/watch?v=e6EQwSadpPk");
        const context = { depth: false, incognito: true };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=e6EQwSadpPk&incognito=true",
        );
    });

    it("should return embed video id [youtube]", async function () {
        const url = new URL("https://invidio.us/embed/8cmBd7lkunk");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=8cmBd7lkunk&incognito=false",
        );
    });
});
