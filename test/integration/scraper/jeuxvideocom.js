import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: JeuxVideoCom", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("http://www.jeuxvideo.com/videos-de-jeux.htm");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL from videos-editors page [ldjson]",
                                                         async function () {
        const url = new URL("http://www.jeuxvideo.com/videos-editeurs/0000" +
                               "/00007335/half-life-2-pc-trailer-00004956.htm");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://videohd.jeuxvideo.com/videos_editeurs/0000" +
                                                          "/00004956-high.mp4");
    });

    it("should return video URL from extracts-videos page [ldjson]",
                                                         async function () {
        const url = new URL("http://www.jeuxvideo.com/extraits-videos-jeux" +
                       "/0002/00023827/portal-2-pc-meet-wheatley-00008311.htm");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://videohd.jeuxvideo.com/extraits/201104" +
                                              "/portal_2_pc-00008311-high.mp4");
    });

    it("should return video URL [ldjson]", async function () {
        const url = new URL("http://www.jeuxvideo.com/videos/461728" +
                "/superhot-notre-avis-en-deux-minutes-sur-ce-fps-original.htm");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://video1080.jeuxvideo.com/news/v/t" +
                                     "/vtsuperhot-259342-1457111085-1080p.mp4");
    });
});
