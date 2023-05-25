/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Dumpert", function () {
    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://www.dumpert.nl/item/7924631_3a727e30");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://media.dumpert.nl/tablet" +
                "/3a727e30_d9d8ccbfaeef83c3.mp4.mp4.mp4",
        );
    });

    it("should return video URL when protocol is HTTP [opengraph]", async function () {
        const url = new URL("http://www.dumpert.nl/item/7924631_3a727e30");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://media.dumpert.nl/tablet" +
                "/3a727e30_d9d8ccbfaeef83c3.mp4.mp4.mp4",
        );
    });

    it("should return video URL from old page [opengraph]", async function () {
        const url = new URL(
            "https://www.dumpert.nl/mediabase/7248279/47066e59" +
                "/wheelie_in_ny.html",
        );
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.equal(
            file,
            "https://media.dumpert.nl/tablet" +
                "/47066e59_This_is_some_impressive_douchebaggery.mp4.mp4.mp4",
        );
    });
});
