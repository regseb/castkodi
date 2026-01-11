/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Le Point", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://www.lepoint.fr/economie" +
                "/desinformation-l-ue-accentue-la-pression-sur-les-geants-d" +
                "-internet-29-01-2019-2289710_28.php" +
                "#xtmc=firefox&xtnp=1&xtcr=4",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL of Dailymotion", async function () {
        const url = new URL(
            "https://www.lepoint.fr/eureka" +
                "/combien-de-temps-un-moustique-survit-il-sans-piquer" +
                "-13-11-2025-2603038_4706.php",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x8ld0t9",
        );
    });

    it("should return video URL [iframe-youtube]", async function () {
        const url = new URL(
            "https://www.lepoint.fr/pop-culture" +
                "/tout-ce-qu-il-faut-savoir-sur-le-prochain-oss-117-" +
                "-20-02-2020-2363643_2920.php",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=SE6jppsjo9E&incognito=false",
        );
    });
});
