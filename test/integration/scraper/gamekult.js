import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Gamekult", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.gamekult.com/jeux/dead-cells-3050326015" +
                                                                "/joueurs.html";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://www.gamekult.com/actualite" +
                                       "/revivez-la-conference-bethesda-et-le" +
                               "-debriefing-avec-le-plateau-gk-3050817795.html";
        const options = { "depth": 0, "incognito": false };
        const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x7aour7";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL without 'www'", async function () {
        const url = "https://gamekult.com/jeux/dead-cells-3050326015" +
                                                "/video-3052201259.html#player";
        const options = { "depth": 0, "incognito": false };
        const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x6o6sws";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
