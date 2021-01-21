import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VTM GO", function () {

    // Needs a consent and login
    // it("should return video URL when format is live-kijken/<channelname>"
    //   , async function () {
    //     const url = new URL("https://vtm.be/vtmgo/live-kijken/vtm");
    //     const options = { depth: false, incognito: false };
    //
    //     const file = await extract(url, options);
    //     assert.strictEqual(file,
    //         "plugin://plugin.video.vtm.go/play/catalog/" +
    //                                  "channels/" +
    //                                  "d8659669-b964-414c-aa9c-e31d8d15696b");
    // });

    it("should return video URL when format is afspelen/<character><uuid>"
      , async function () {
        const url = new URL("https://www.vtm.be/vtmgo" +
                             "/afspelen/e2bb78f60-e096-4ba3-8611-d5214f0f5d76");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/" +
                               "episodes/2bb78f60-e096-4ba3-8611-d5214f0f5d76");
    });

    it("should return video URL when format is <name>~<character><uuid>"
      , async function () {
        const url = new URL("https://www.vtm.be/vtmgo" +
                        "/bowling-balls~m31b2acd3-1659-4ed0-885e-5f49999fbfdb");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/" +
                                 "movies/31b2acd3-1659-4ed0-885e-5f49999fbfdb");
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://www.vtm.be/vtmgo" +
                             "/afspelen/m119e8927-e1c6-4764-b1ad-deaab1920427");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/" +
                                 "movies/119e8927-e1c6-4764-b1ad-deaab1920427");
    });

    it("should return video URL without 'www'", async function () {
        const url = new URL("https://vtm.be/vtmgo" +
                  "/bang-van-dendoncker~m119e8927-e1c6-4764-b1ad-deaab1920427");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/" +
                                 "movies/119e8927-e1c6-4764-b1ad-deaab1920427");
    });
});
