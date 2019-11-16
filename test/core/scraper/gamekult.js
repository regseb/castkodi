import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/gamekult.js";

describe("scraper/gamekult", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "http://www.gameblog.fr/";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://www.gamekult.com/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://www.gamekult.com/jeux/dead-cells-3050326015" +
                                                                "/joueurs.html";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://www.gamekult.com/actualite" +
                                       "/revivez-la-conference-bethesda-et-le" +
                               "-debriefing-avec-le-plateau-gk-3050817795.html";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x7aour7";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });

    describe("*://gamekult.com/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return video URL", async function () {
            const url = "https://www.gamekult.com/jeux" +
                                                  "/dead-cells-3050326015.html";
            const expected = "plugin://plugin.video.dailymotion_com/" +
                                                  "?mode=playVideo&url=x6o6sws";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
