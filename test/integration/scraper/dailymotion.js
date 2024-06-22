/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dailymotion", function () {
    it("should return video id", async function () {
        const url = new URL("https://www.dailymotion.com/video/x17qw0a");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x17qw0a",
        );
    });

    it("should return tiny video id", async function () {
        const url = new URL("https://dai.ly/x5riqme");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x5riqme",
        );
    });

    it("should return embed video id", async function () {
        const url = new URL("https://www.dailymotion.com/embed/video/a12bc3d");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=a12bc3d",
        );
    });
});
