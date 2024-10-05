/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: DevTube", function () {
    it("should return video id", async function () {
        const url = new URL("https://dev.tube/video/4rWypxBwrR4");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=4rWypxBwrR4&incognito=false",
        );
    });
});
