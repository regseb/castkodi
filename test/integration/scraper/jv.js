/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: JV (Jeuxvideo.com) [fr]", function () {
    before(function () {
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.jeuxvideo.com/videos-de-jeux.htm");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL from videos-editors page", async function () {
        const url = new URL(
            "https://www.jeuxvideo.com/videos-editeurs/0000/00007335" +
                "/half-life-2-pc-trailer-00004956.htm",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x89cq08",
        );
    });

    it("should return video URL from extracts-videos page", async function () {
        const url = new URL(
            "https://www.jeuxvideo.com/extraits-videos-jeux/0002/00023827" +
                "/portal-2-pc-meet-wheatley-00008311.htm",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x89i98o",
        );
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.jeuxvideo.com/videos/461728" +
                "/superhot-notre-avis-en-deux-minutes-sur-ce-fps-original.htm",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x89lx2g",
        );
    });

    it("should return video URL from news", async function () {
        const url = new URL(
            "https://www.jeuxvideo.com/news/1415571" +
                "/doom-eternal-plus-beau-que-jamais-en-4k-ray-tracing-sur-une" +
                "-rtx-3080-ti.htm",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x89nrvo",
        );
    });
});
