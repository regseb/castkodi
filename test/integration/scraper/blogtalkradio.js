/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Blog Talk Radio", function () {
    it("should return undefined when it isn't an audio", async function () {
        const url = new URL("https://www.blogtalkradio.com/technology");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL", async function () {
        const url = new URL(
            "https://www.blogtalkradio.com/weekdayswithmurph/2013/04/24" +
                "/kodi-kitchen-live-interview-2",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.blogtalkradio.com/weekdayswithmurph/2013/04/24" +
                "/kodi-kitchen-live-interview-2.mp3",
        );
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.blogtalkradio.com/weekdayswithmurph/2013/04/24" +
                "/kodi-kitchen-live-interview-2",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "https://www.blogtalkradio.com/weekdayswithmurph/2013/04/24" +
                "/kodi-kitchen-live-interview-2.mp3",
        );
    });
});
