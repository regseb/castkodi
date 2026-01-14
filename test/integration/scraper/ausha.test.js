/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Ausha", () => {
    it("should return undefined when it isn't an audio", async () => {
        const url = new URL("https://podcast.ausha.co/dont/exist");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL", async () => {
        const url = new URL(
            "https://podcast.ausha.co/firstprintfra/fp-aout-2022-1",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, "https://audio.ausha.co/b3RDWTvLDnEK.mp3");
    });
});
