import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Gamekult", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.gamekult.com/jeux" +
                                         "/dead-cells-3050326015/joueurs.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.gamekult.com/actualite" +
                                       "/revivez-la-conference-bethesda-et-le" +
                              "-debriefing-avec-le-plateau-gk-3050817795.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                                "&url=x7aour7");
    });

    it("should return video URL without 'www'", async function () {
        const url = new URL("https://gamekult.com/jeux/dead-cells-3050326015" +
                                               "/video-3052201259.html#player");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                                "&url=x6o6sws");
    });
});
