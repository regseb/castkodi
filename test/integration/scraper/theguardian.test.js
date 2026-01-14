/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: The Guardian", () => {
    it("should return undefined when it isn't a video / audio", async () => {
        const url = new URL(
            "https://www.theguardian.com/technology/2019/nov/17" +
                "/firefox-mozilla-fights-back-against-google-chrome-dominance" +
                "-privacy-fears",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [theguardian-youtube]", async () => {
        const url = new URL(
            "https://www.theguardian.com/sport/video/2021/oct/18" +
                "/dont-let-it-drop-peru-win-the-first-ever-balloon-world-cup" +
                "-video",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=Iiigz06_lvM&incognito=false",
        );
    });

    it("should return audio URL", async () => {
        const url = new URL(
            "https://www.theguardian.com/news/audio/2020/feb/25" +
                "/could-coronavirus-be-china-chernobyl-moment-podcast",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://audio.guim.co.uk/2020/02/24-70184-200225TIFchina.mp3",
        );
    });
});
