/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Kickstarter", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://www.kickstarter.com/projects/playeress" +
                "/whos-she-a-guessing-game-about-extraordinary-women",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    // Désactiver ce test, car Kickstarter bloque les requêtes venant de Node.js
    // ("www.kickstarter.com needs to review the security of your connection
    // before proceeding. Performance & security by Cloudflare").
    it.skip("should return video URL [media]", async function () {
        const url = new URL(
            "https://www.kickstarter.com/projects/coreywright" +
                "/kartoffelkrieg-potato-wars",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.endsWith("/projects/3266544/video-870029-hls_playlist.m3u8"),
            `"${file}"?.endsWith(...)`,
        );
    });
});
