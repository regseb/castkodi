/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: VRT NU", () => {
    it("should return video URL", async () => {
        const url = new URL(
            "https://www.vrt.be/vrtnu/a-z/het-journaal/2019" +
                "/het-journaal-het-journaal-13u-20190901/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/https://www.vrt.be/vrtnu/a-z/het-journaal/2019" +
                "/het-journaal-het-journaal-13u-20190901/",
        );
    });

    it("should return video URL without 'www'", async () => {
        const url = new URL(
            "https://vrt.be/vrtnu/a-z/koppen/2016/koppen-d20180721/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/https://vrt.be/vrtnu/a-z/koppen/2016/koppen-d20180721/",
        );
    });

    it("should return video URL from 'link' page", async () => {
        const url = new URL("https://vrtnu.page.link/KXWX");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.video.vrt.nu/play/url" +
                "/https://vrtnu.page.link/KXWX",
        );
    });
});
