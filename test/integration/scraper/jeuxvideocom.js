import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: JeuxVideoCom", function () {
    it("should return URL when it's not a video", async function () {
        const url = "http://www.jeuxvideo.com/videos-de-jeux.htm";
        const options = { depth: 0, incognito: false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL from videos-editors page",
                                                         async function () {
        const url = "http://www.jeuxvideo.com/videos-editeurs/0000/00007335" +
                                         "/half-life-2-pc-trailer-00004956.htm";
        const options = { depth: 0, incognito: false };
        const expected = "http://videohd.jeuxvideo.com/videos_editeurs/0000" +
                                                           "/00004956-high.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL from extracts-videos page",
                                                         async function () {
        const url = "http://www.jeuxvideo.com/extraits-videos-jeux/0002" +
                             "/00023827/portal-2-pc-meet-wheatley-00008311.htm";
        const options = { depth: 0, incognito: false };
        const expected = "http://videohd.jeuxvideo.com/extraits/201104" +
                                               "/portal_2_pc-00008311-high.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "http://www.jeuxvideo.com/videos/461728" +
                 "/superhot-notre-avis-en-deux-minutes-sur-ce-fps-original.htm";
        const options = { depth: 0, incognito: false };
        const expected = "http://video1080.jeuxvideo.com/news/v/t" +
                                      "/vtsuperhot-259342-1457111085-1080p.mp4";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
