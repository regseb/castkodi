import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: StarGR", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.star.gr/lifestyle/media");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.star.gr/video/lifestyle/viral/549561" +
                                    "/ayto-einai-to-pshlotero-kastro-apo-ammo");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://cdnapisec.kaltura.com/p/713821/sp/0" +
                           "/playManifest/entryId/1_dy97qz9k/format/applehttp" +
                               "/protocol/https/flavorParamId/0/manifest.m3u8");
    });

    it("should return video URL from StarTV", async function () {
        const url = new URL("https://www.star.gr/tv/enimerosi" +
                   "/kedriko-deltio-eidiseon/kedriko-deltio-eidiseon-3132021/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://cdnapisec.kaltura.com/p/713821/sp" +
                         "/0/playManifest/entryId/1_uscdf5as/format/applehttp" +
                               "/protocol/https/flavorParamId/0/manifest.m3u8");
    });

    it("should return video URL from StarTV when protocol is HTTP",
                                                             async function () {
        const url = new URL("http://www.star.gr/tv/psychagogia/globetrotters" +
               "/to-neo-taxidiotiko-paihnidi-tou-star-globetrotters-xekinaei/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "https://cdnapisec.kaltura.com/p/713821/sp/0" +
                           "/playManifest/entryId/1_p9vdk3nq/format/applehttp" +
                               "/protocol/https/flavorParamId/0/manifest.m3u8");
    });

    it("should return video id [stargr-youtube]", async function () {
        const url = new URL("https://www.star.gr/tv/psychagogia" +
                             "/ston-kosmo-tou/ston-kosmo-tou-2042019-tiflida/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, "plugin://plugin.video.youtube/play/" +
                                       "?video_id=p9DYioRLAXE&incognito=false");
    });
});
