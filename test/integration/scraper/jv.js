import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: JV", function () {
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
            "https://video.jeuxvideo.com/videos_editeurs/0000" +
                                                           "/00004956-low.mp4");
    });

    it("should return video URL from extracts-videos page [ldjson]",
                                                         async function () {
        const url = new URL("http://www.jeuxvideo.com/extraits-videos-jeux" +
                       "/0002/00023827/portal-2-pc-meet-wheatley-00008311.htm");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://video.jeuxvideo.com/extraits/201104" +
                                               "/portal_2_pc-00008311-low.mp4");
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

    it("should return video URL from news", async function () {
        const url = new URL("https://www.jeuxvideo.com/news/1415571" +
                                    "/doom-eternal-plus-beau-que-jamais-en-4k" +
                                        "-ray-tracing-sur-une-rtx-3080-ti.htm");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://video.jeuxvideo.com/videos_editeurs/d/o" +
                           "/doom-eternal-the-ancient-gods-part-ii-montre-son" +
                                 "-nouvel-ennemi-1335993-1615994365-2160p.mp4");
    });
});
