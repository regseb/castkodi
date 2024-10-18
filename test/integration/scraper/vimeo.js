/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

// Désactiver les tests, car Vimeo détecte que la requête provient d'un robot et
// il affiche une page de vérification.
//
// """
//  Verify to continue
//
//  To continue, please confirm that you're a human (and not a spambot).
//  Checking if the site connection is secure
//
//  vimeo.com needs to review the security of your connection before proceeding.
// """
describe.skip("Scraper: Vimeo", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://vimeo.com/channels");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video id [ldjson-vimeo]", async function () {
        const url = new URL("https://vimeo.com/228786490");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=228786490:a81341a31d",
        );
    });

    it("should return video id when protocol is HTTP [ldjson-vimeo]", async function () {
        const url = new URL("http://vimeo.com/228786490");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=228786490:a81341a31d",
        );
    });

    it("should return video id from groups video [ldjson-vimeo]", async function () {
        const url = new URL("https://vimeo.com/groups/motion/videos/93206523");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=93206523:d496437eee",
        );
    });

    it("should return video id from unlisted video [ldjson-vimeo]", async function () {
        const url = new URL("https://vimeo.com/304887422/34c51f7a09");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=304887422:34c51f7a09",
        );
    });

    it("should return embed video id", async function () {
        const url = new URL("https://player.vimeo.com/video/228786490");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=228786490",
        );
    });

    it("should return embed video id from unlisted video", async function () {
        const url = new URL(
            "https://player.vimeo.com/video/304887422?autoplay=1&h=34c51f7a09",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vimeo/play/?video_id=304887422:34c51f7a09",
        );
    });
});
