import assert from "node:assert";
import sinon from "sinon";
import { kodi } from "../../../src/core/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: The Guardian", function () {
    it("should return URL when it's not a video / audio", async function () {
        const url = new URL("https://www.theguardian.com/technology/2019/nov" +
                                     "/17/firefox-mozilla-fights-back-against" +
                                      "-google-chrome-dominance-privacy-fears");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL [theguardian-youtube]", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.theguardian.com/sport/video/2021/oct" +
                                           "/18/dont-let-it-drop-peru-win-the" +
                                         "-first-ever-balloon-world-cup-video");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/" +
                                       "?video_id=Iiigz06_lvM&incognito=false");

        assert.strictEqual(stub.callCount, 1);
        assert.deepStrictEqual(stub.firstCall.args, ["video"]);
    });

    it("should return audio URL", async function () {
        const url = new URL("https://www.theguardian.com/news/audio/2020/feb" +
                     "/25/could-coronavirus-be-china-chernobyl-moment-podcast");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "https://audio.guim.co.uk/2020/02/24-70184-200225TIFchina.mp3");
    });
});
