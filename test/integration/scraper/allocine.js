import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: AlloCiné", function () {
    it("should return URL when it's not a video", async function () {
        const url = "http://www.allocine.fr/video/";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return standard video URL", async function () {
        const url = "http://www.allocine.fr/video/video-19577157/";
        const expected = "https://fr.vid.web.acsta.net/nmedia/33/18/02/23/15" +
                                                         "/19577157_sd_013.mp4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return high video URL", async function () {
        const url = "http://www.allocine.fr/video" +
                                "/player_gen_cmedia=19583315&cfilm=232669.html";
        const expected = "http://fr.vid.web.acsta.net/nmedia/33/19/04/02/14" +
                                                        "//19583315_hd_013.mp4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return medium video URL", async function () {
        const url = "http://www.allocine.fr/video" +
                                  "/player_gen_cmedia=19432206&cfilm=1051.html";
        const expected = "http://fr.vid.web.acsta.net/nmedia/s3/33/18/66/14" +
                                                      "/37/19432206_sd_013.mp4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL from RSS", async function () {
        const url = "http://rss.allocine.fr/~r/ac/actualites/cine/~3" +
                         "/JT3DmCdQCdQ/fichearticle_gen_carticle=18685966.html";
        const expected = "http://fr.vid.web.acsta.net/nmedia/33/19/11/22/16" +
                                                        "//19586672_hd_013.mp4";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
