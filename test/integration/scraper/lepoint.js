/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Le Point", function () {
    it("should return undefined when it isn't a video", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.lepoint.fr/economie" +
                "/desinformation-l-ue-accentue-la-pression-sur-les-geants-d" +
                "-internet-29-01-2019-2289710_28.php" +
                "#xtmc=firefox&xtnp=1&xtcr=4",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, undefined);
    });

    it("should return video URL of Dailymotion", async function () {
        const url = new URL(
            "https://www.lepoint.fr/astronomie" +
                "/un-nouveau-signal-radio-extraterrestre-intrigue-les" +
                "-scientifiques-18-02-2020-2363244_1925.php" +
                "#xtmc=video&xtnp=7&xtcr=61",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x7rz0ur",
        );
    });

    it("should return video URL of Dailymotion when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.lepoint.fr/astronomie" +
                "/un-nouveau-signal-radio-extraterrestre-intrigue-les" +
                "-scientifiques-18-02-2020-2363244_1925.php" +
                "#xtmc=video&xtnp=7&xtcr=61",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=x7rz0ur",
        );
    });

    it("should return video URL [iframe-youtube]", async function () {
        sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL(
            "https://www.lepoint.fr/pop-culture" +
                "/tout-ce-qu-il-faut-savoir-sur-le-prochain-oss-117-" +
                "-20-02-2020-2363643_2920.php",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "plugin://plugin.video.youtube/play/" +
                "?video_id=SE6jppsjo9E&incognito=false",
        );
    });
});
