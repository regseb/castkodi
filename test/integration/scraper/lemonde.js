import assert from "node:assert";
import sinon from "sinon";
import { config } from "../config.js";
import { kodi } from "../../../src/core/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Le Monde", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.lemonde.fr/pixels/article/2015/02/27" +
                                     "/on-a-teste-pour-vous-le-raspberry-pi-l" +
                             "-ordinateur-miniature-a-35_4584204_4408996.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video id [lemonde-youtube]", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.lemonde.fr/blog/unmondedejeux/2021" +
                             "/02/02/la-selection-officielle-de-las-dor-2021/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=dI-xlzU-r1c&incognito=false");

        assert.strictEqual(stub.callCount, 1);
        assert.deepStrictEqual(stub.firstCall.args, ["video"]);
    });

    it("should return video id [lemonde-dailymotion]", async function () {
        const url = new URL("https://www.lemonde.fr/sciences/article/2021/02" +
                                   "/02/un-prototype-de-fusee-spacex-s-ecrase" +
                                      "-a-l-atterrissage_6068556_1650684.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/" +
                                     "?mode=playVideo&url=k3tyb33F0pcZR2wDd27");
    });

    it("should return video url [lemonde-tiktok]", async function () {
        if (undefined !== config.country && "us" === config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }

        const url = new URL("https://www.lemonde.fr/actualite-medias/article" +
                                     "/2020/06/18/le-monde-sur-tiktok-la-meme" +
                                   "-info-de-nouveaux-codes_6043338_3236.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.includes("&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0" +
                                       "&qs=0&rc=MzZqZ201ZzxleDMzNjczM0ApOzln" +
                                        "ZTY5ZWQ5Nzw5ZWQ1Z2dfLmhqb2twazJfLS0t" +
                                        "MTRzc2NjYC41MTYzXi1iYTMwMTM6Yw%3D%3D"),
                  `"${file}"?.includes(...)`);
    });
});
