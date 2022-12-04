import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: StarGR", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.star.gr/lifestyle/media");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL from StarTV", async function () {
        const url = new URL("https://www.star.gr/tv/psychagogia" +
                                                     "/dancing-with-the-stars" +
                                   "/dwts-o-edouard-stergiou-gia-ti-summetohi" +
                                            "-tou-sto-dancing-with-the-stars/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://cdnapisec.kaltura.com/p/713821/sp/0/playManifest/entryId" +
                "/1_dodsq0jt/format/applehttp/protocol/https/flavorParamId/0" +
                "/manifest.m3u8");
    });

    it("should return video URL from StarTV when protocol is HTTP",
                                                             async function () {
        const url = new URL("http://www.star.gr/tv/psychagogia/globetrotters" +
               "/to-neo-taxidiotiko-paihnidi-tou-star-globetrotters-xekinaei/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://cdnapisec.kaltura.com/p/713821/sp/0/playManifest/entryId" +
                "/1_p9vdk3nq/format/applehttp/protocol/https/flavorParamId/0" +
                "/manifest.m3u8");
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.star.gr/video/lifestyle/viral/527838" +
                               "/to-megalytero-festibal-pagoy-einai-sthn-kina");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://cdnapisec.kaltura.com/p/713821/sp/0/playManifest/entryId" +
                "/1_ppyp3x8c/format/applehttp/protocol/https/flavorParamId/0" +
                "/manifest.m3u8");
    });

    it("should return video id", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.star.gr/video/lifestyle/viral/165501" +
                                 "/teleio_papagaloi_chorevoun_se_rap_rythmous");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "plugin://plugin.video.youtube/play/?video_id=c-AgydAVh5k" +
                                               "&incognito=false");

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });
});
