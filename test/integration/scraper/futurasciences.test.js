/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Futura Sciences", () => {
    it("should return page undefined when there isn't video", async () => {
        const url = new URL(
            "https://www.futura-sciences.com/tech/telecharger/kodi-287",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [iframe-youtube]", async () => {
        const url = new URL(
            "https://www.futura-sciences.com/sciences/actualites" +
                "/astronomie-spectaculaire-james-webb-capture-eruption-autour" +
                "-trou-noir-geant-notre-galaxie-w2t8-129921/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/?video_id=NHhFBxTh5Ok&incognito=false",
        );
    });
});
