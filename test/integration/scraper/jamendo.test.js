/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: Jamendo", () => {
    it("should return undefined when it isn't a sound", async () => {
        const url = new URL("https://www.jamendo.com/track/404/not-found");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return audio URL [opengraph]", async () => {
        const url = new URL(
            "https://www.jamendo.com/track/3431/avant-j-etais-trappeur",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "https://prod-1.storage.jamendo.com/?trackid=3431&format=mp31",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });
});
