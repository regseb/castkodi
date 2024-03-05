/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Melty", function () {
    it("should return URL [iframe-youtube]", async function () {
        const url = new URL(
            "https://www.melty.fr/cinema/cruella-2-emma-stone-tease-enfin-la" +
                "-suite-1701221.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=VKbJsznd7pg&incognito=false",
        );
    });
});
