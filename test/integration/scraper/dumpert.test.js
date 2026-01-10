/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dumpert", function () {
    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://www.dumpert.nl/item/7924631_3a727e30");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://media.dumpert.nl/dmp/media/video/a/1/6" +
                "/a167015b-93df-5ead-e5c6-c3768463966e/270/index.m3u8",
        );
    });

    it("should return video URL when protocol is HTTP [opengraph]", async function () {
        const url = new URL("http://www.dumpert.nl/item/7924631_3a727e30");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://media.dumpert.nl/dmp/media/video/a/1/6" +
                "/a167015b-93df-5ead-e5c6-c3768463966e/270/index.m3u8",
        );
    });

    it("should return video URL from old page [opengraph]", async function () {
        const url = new URL(
            "https://www.dumpert.nl/mediabase/7248279/47066e59" +
                "/wheelie_in_ny.html",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://media.dumpert.nl/dmp/media/video/8/a/d" +
                "/8adef26e-1e1b-c12b-1cb9-57e6bf34912c/270/index.m3u8",
        );
    });
});
