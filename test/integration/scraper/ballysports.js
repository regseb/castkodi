/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Bally Sports", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.ballysports.com/watch/vod/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    // Désactiver ce test car jsdom (avec nwsapi) n'est pas identique à
    // DOMParser des navigateurs. https://github.com/jsdom/jsdom/issues/3416
    it.skip("should return video URL", async function () {
        const url = new URL(
            "https://www.ballysports.com/watch/vod" +
                "/hunter-greene-has-made-a-habit-of-giving-back-to-kids",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://fr.vid.web.acsta.net/nmedia/33/18/02/23/15" +
                "/19577157_hd_013.mp4",
        );
    });
});
