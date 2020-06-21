import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Le Point", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://www.lepoint.fr/economie" +
                                            "/desinformation-l-ue-accentue-la" +
                                         "-pression-sur-les-geants-d-internet" +
                                                  "-29-01-2019-2289710_28.php" +
                                                  "#xtmc=firefox&xtnp=1&xtcr=4";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL [iframe-dailymotion]", async function () {
        const url = "https://www.lepoint.fr/astronomie" +
                                     "/un-nouveau-signal-radio-extraterrestre" +
                                                 "-intrigue-les-scientifiques" +
                                                "-18-02-2020-2363244_1925.php" +
                                                   "#xtmc=video&xtnp=7&xtcr=61";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/" +
                                                 "?mode=playVideo&url=x7rz0ur");
    });

    it("should return video URL [iframe-youtube]", async function () {
        const url = "https://www.lepoint.fr/pop-culture" +
                         "/tout-ce-qu-il-faut-savoir-sur-le-prochain-oss-117-" +
                                                 "-20-02-2020-2363643_2920.php";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=SE6jppsjo9E&incognito=false");
    });
});
