/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Konbini", () => {
    it("should return URL [iframe-dailymotion]", async () => {
        const url = new URL(
            "https://www.konbini.com/fr/cinema/video-8-choses-palmashow",
        );
        const context = { depth: false, incognito: true };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x81cjw7",
        );
    });
});
