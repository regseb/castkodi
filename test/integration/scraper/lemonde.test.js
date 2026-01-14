/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";
import "../setup.js";

describe("Scraper: Le Monde", () => {
    it("should return undefined when it isn't a video", async () => {
        const url = new URL(
            "https://www.lemonde.fr/pixels/article/2015/02/27" +
                "/on-a-teste-pour-vous-le-raspberry-pi-l-ordinateur-miniature" +
                "-a-35_4584204_4408996.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video id [lemonde-youtube]", async () => {
        const url = new URL(
            "https://www.lemonde.fr/blog/unmondedejeux/2021/02/02" +
                "/la-selection-officielle-de-las-dor-2021/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=cz81uaXm5ps&incognito=false",
        );
    });

    it("should return video id [lemonde-dailymotion]", async () => {
        const url = new URL(
            "https://www.lemonde.fr/sciences/article/2021/02/02" +
                "/un-prototype-de-fusee-spacex-s-ecrase-a-l-atterrissage" +
                "_6068556_1650684.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/" +
                "?mode=playVideo&url=k3tyb33F0pcZR2wDd27",
        );
    });

    it("should return video url [lemonde-tiktok]", async (t) => {
        if (undefined !== config.country && "us" === config.country) {
            t.skip();
        }

        const url = new URL(
            "https://www.lemonde.fr/actualite-medias/article/2020/06/18" +
                "/le-monde-sur-tiktok-la-meme-info-de-nouveaux-codes" +
                "_6043338_3236.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file &&
                "video_mp4" === new URL(file).searchParams.get("mime_type"),
            `"..." === new URL("${file}").searchParams.get("mime_types")`,
        );
    });
});
