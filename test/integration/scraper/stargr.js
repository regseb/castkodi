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
        const url = new URL("https://www.star.gr/video/lifestyle/viral/538100");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://cdnapisec.kaltura.com/p/713821/sp" +
                         "/0/playManifest/entryId/1_n0gatj56/format/applehttp" +
                               "/protocol/https/flavorParamId/0/manifest.m3u8"),
                  `"${file}"?.startsWith(...)`);
    });

    it("should return video URL from StarTV", async function () {
        const url = new URL("https://www.star.gr/tv/enimerosi" +
                   "/kedriko-deltio-eidiseon/kedriko-deltio-eidiseon-3132021/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://cdnapisec.kaltura.com/p/713821/sp" +
                         "/0/playManifest/entryId/1_uscdf5as/format/applehttp" +
                               "/protocol/https/flavorParamId/0/manifest.m3u8"),
                  `"${file}"?.startsWith(...)`);
    });

    it("should return video URL from StarTV when protocol is HTTP",
                                                             async function () {
        const url = new URL("http://www.star.gr/tv/psychagogia" +
                              "/sti-folia-ton-kou-kou/bolonez-garidas-932021/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://cdnapisec.kaltura.com/p/713821/sp" +
                         "/0/playManifest/entryId/1_ocn00cdc/format/applehttp" +
                               "/protocol/https/flavorParamId/0/manifest.m3u8"),
                  `"${file}"?.startsWith(...)`);
    });

    it("should return video id [stargr-youtube]", async function () {
        const url = new URL("https://www.star.gr/tv/psychagogia" +
                             "/ston-kosmo-tou/ston-kosmo-tou-2042019-tiflida/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("plugin://plugin.video.youtube/play/" +
                                       "?video_id=p9DYioRLAXE&incognito=false"),
                  `"${file}"?.startsWith(...)`);
    });
});
