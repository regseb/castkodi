/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Futura Sciences", function () {
    it("should return page undefined when there isn't video", async function () {
        const url = new URL(
            "https://www.futura-sciences.com/tech/telecharger/kodi-287",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [iframe-youtube]", async function () {
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
