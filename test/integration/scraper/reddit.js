import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Reddit", function () {
    it("should return URL when it's not a video [ldjson-reddit]",
                                                             async function () {
        const url = new URL("https://www.reddit.com/r/place/comments/twb3gq" +
                            "/ill_miss_you_rplace/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.reddit.com/r/Portal/comments/ju5buj" +
                            "/70s_aperture_science_logo_animation_i_had_a" +
                            "_lot/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://v.redd.it/2g08wt2wj8z51" +
                                   "/HLSPlaylist.m3u8?"),
                  `"${file}"?.startsWith(...)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://www.reddit.com/r/kodi/comments/7auldg" +
                            "/made_another_kodi_boot_video/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://v.redd.it/ln5ey0q022wz" +
                                   "/HLSPlaylist.m3u8?"),
                  `"${file}"?.startsWith(...)`);
    });
});
