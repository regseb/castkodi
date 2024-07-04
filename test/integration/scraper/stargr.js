/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: StarGR", function () {
    it("should return undefined when it isn't a video", async function () {
        const url = new URL("https://www.star.gr/lifestyle/media");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL from StarTV", async function () {
        const url = new URL(
            "https://www.star.gr/tv/psychagogia/dancing-with-the-stars" +
                "/dwts-o-edouard-stergiou-gia-ti-summetohi-tou-sto-dancing" +
                "-with-the-stars/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdnapisec.siliconweb.com/p/713821/sp/0/playManifest" +
                "/entryId/1_dodsq0jt/format/applehttp/protocol/https" +
                "/flavorParamId/0/manifest.m3u8",
        );
    });

    it("should return video URL from StarTV when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.star.gr/tv/psychagogia/globetrotters" +
                "/to-neo-taxidiotiko-paihnidi-tou-star-globetrotters-xekinaei/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdnapisec.siliconweb.com/p/713821/sp/0/playManifest" +
                "/entryId/1_p9vdk3nq/format/applehttp/protocol/https" +
                "/flavorParamId/0/manifest.m3u8",
        );
    });

    it("should return video URL [ldjson]", async function () {
        const url = new URL(
            "https://www.star.gr/video/lifestyle/viral/630859" +
                "/islandia-h-kayth-laba-reei-katw-se-xeimarroys",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://cdnapisec.siliconweb.com/p/713821/sp/0/playManifest" +
                "/entryId/1_v1t4vt5b/format/applehttp/protocol/https" +
                "/flavorParamId/0/video.mp4",
        );
    });

    it("should return video id [stargr-youtube]", async function () {
        const url = new URL(
            "https://www.star.gr/video/lifestyle/viral/165501" +
                "/teleio_papagaloi_chorevoun_se_rap_rythmous",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/?video_id=c-AgydAVh5k" +
                "&incognito=false",
        );
    });
});
