/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Daily Mail", () => {
    it("should return audio URL [opengraph]", async () => {
        const url = new URL(
            "https://www.dailymail.co.uk/sciencetech/article-8057229" +
                "/Scientists-create-stunning-gifs-Mars-sand-dunes-understand" +
                "-conditions-impact-them.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://video.dailymail.com/video/mol/2019/12/12" +
                "/4423536678317962457/1024x576_MP4_4423536678317962457.mp4",
        );
    });
});
