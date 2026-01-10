/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Reddit [fr]", function () {
    before(function () {
        // Désactiver les tests de Reddit aux États-Unis, car la récupération ne
        // semble pas fonctionner.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://www.reddit.com/r/place/comments/twb3gq" +
                "/ill_miss_you_rplace/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.reddit.com/r/Portal/comments/ju5buj" +
                "/70s_aperture_science_logo_animation_i_had_a_lot/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "https://v.redd.it/2g08wt2wj8z51/HLSPlaylist.m3u8?",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });

    it("should return video URL embed [reddit-iframe-youtube]", async function () {
        const url = new URL(
            "https://www.reddit.com/r/TMNT/comments/1e1nkk8" +
                "/every_tmnt_movie_ever/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=s91Hs241YS4&incognito=false",
        );
    });

    it("should return old video URL", async function () {
        const url = new URL(
            "https://old.reddit.com/r/Unexpected/comments/1l83vph" +
                "/fliping_each_other/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "https://v.redd.it/cs5l1nf8r46f1/HLSPlaylist.m3u8",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });
});
