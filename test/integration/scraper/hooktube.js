/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: HookTube", function () {
    it("should return video id [youtube]", async function () {
        await browser.storage.local.set({ "youtube-playlist": "video" });

        const url = new URL("https://hooktube.com/watch?v=LACbVhgtx9I");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=LACbVhgtx9I&incognito=false",
        );
    });

    it("should return embed video id [youtube]", async function () {
        const url = new URL("https://hooktube.com/embed/3lPSQ5KjamI");
        const context = { depth: false, incognito: true };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=3lPSQ5KjamI&incognito=true",
        );
    });
});
