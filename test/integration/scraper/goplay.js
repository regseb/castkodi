import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: GoPlay", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.goplay.be/programmas");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.goplay.be/video/homeparty-met-kat" +
                    "/kat-praat-met-onze-echte-helden-de-zorgverleners");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://stream2-vod.cdn1.sbs.prd.telenet-ops.be/non-geo/vier" +
                   "/homepartymetkat/3b576cf4fa1df85b8cc29c90efcdac81a9f97ecf" +
                             "/HOMEPARTYMETKAT_zorg/HOMEPARTYMETKAT_zorg.m3u8");
    });
});
