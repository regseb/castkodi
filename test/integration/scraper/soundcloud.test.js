/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: SoundCloud", () => {
    it("should return audio url", async () => {
        const url = new URL(
            "https://soundcloud.com/a-tribe-called-red/electric-pow-wow-drum",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.audio.soundcloud/play/" +
                "?url=https%3A%2F%2Fsoundcloud.com%2Fa-tribe-called-red" +
                "%2Felectric-pow-wow-drum",
        );
    });

    it("should return audio url from mobile version", async () => {
        const url = new URL("https://mobi.soundcloud.com/esa/a-singing-comet");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(
            file,
            "plugin://plugin.audio.soundcloud/play/" +
                "?url=https%3A%2F%2Fsoundcloud.com%2Fesa" +
                "%2Fa-singing-comet",
        );
    });
});
