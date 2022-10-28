import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VRT NU", function () {
    it("should return video URL", async function () {
        const url = new URL("https://www.vrt.be/vrtnu/a-z/het-journaal/2019" +
                                    "/het-journaal-het-journaal-13u-20190901/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/https://www.vrt.be/vrtnu/a-z/het-journaal/2019" +
                "/het-journaal-het-journaal-13u-20190901/");
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://www.vrt.be/vrtnu/a-z/pano/2019" +
                                                              "/pano-s2019a9/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/http://www.vrt.be/vrtnu/a-z/pano/2019/pano-s2019a9/");
    });

    it("should return video URL without 'www'", async function () {
        const url = new URL("https://vrt.be/vrtnu/a-z/koppen/2016" +
                                                          "/koppen-d20180721/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/https://vrt.be/vrtnu/a-z/koppen/2016/koppen-d20180721/");
    });

    it("should return video URL from 'link' page", async function () {
        const url = new URL("https://vrtnu.page.link/KXWX");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/https://vrtnu.page.link/KXWX");
    });
});
