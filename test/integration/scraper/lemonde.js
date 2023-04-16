/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Le Monde", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.lemonde.fr/pixels/article/2015/02/27" +
                "/on-a-teste-pour-vous-le-raspberry-pi-l-ordinateur-miniature" +
                "-a-35_4584204_4408996.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video id [lemonde-youtube]", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.lemonde.fr/blog/unmondedejeux/2021/02/02" +
                "/la-selection-officielle-de-las-dor-2021/",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=cz81uaXm5ps&incognito=false",
        );
    });

    it("should return video id [lemonde-dailymotion]", async function () {
        const url = new URL(
            "https://www.lemonde.fr/sciences/article/2021/02/02" +
                "/un-prototype-de-fusee-spacex-s-ecrase-a-l-atterrissage" +
                "_6068556_1650684.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/" +
                "?mode=playVideo&url=k3tyb33F0pcZR2wDd27",
        );
    });

    it("should return video url [lemonde-tiktok]", async function () {
        if (undefined !== config.country && "us" === config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }

        const url = new URL(
            "https://www.lemonde.fr/actualite-medias/article/2020/06/18" +
                "/le-monde-sur-tiktok-la-meme-info-de-nouveaux-codes" +
                "_6043338_3236.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(
            undefined !== file &&
                "video_mp4" === new URL(file).searchParams.get("mime_type"),
            `"..." === new URL("${file}").searchParams.get("mime_types")`,
        );
    });
});
