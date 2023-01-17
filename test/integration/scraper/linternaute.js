import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: L'Internaute", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.linternaute.com/cinema/film" +
                            "/2462551-films-pixar-selection-des-meilleurs-et" +
                            "-liste-de-tous-les-films-pixar/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file, url.href);
    });

    it("should return video URL [ldjson]", async function () {
        const url = new URL("https://www.linternaute.com/sport/rugby" +
                            "/2617245-rugby-france-angleterre-suivez-le-match" +
                            "-des-6-nations-en-direct/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "https://media.ccmbg.com/vc/1647588853/8654741851/960911.mp4");
    });

    it("should return video URL [template-iframe-youtube]", async function () {
        const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

        const url = new URL("https://www.linternaute.fr/cinema/pratique" +
                            "/2595113-alerte-rouge-a-partir-de-quel-age-voir" +
                            "-le-dernier-film-pixar/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "plugin://plugin.video.youtube/play/?video_id=cMAiO2X12tk" +
                                               "&incognito=false");

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.firstCall.args, ["video"]);
    });
});
