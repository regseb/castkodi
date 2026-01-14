/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Scraper: ItemFix", () => {
    it("should return undefined when it isn't a video", async () => {
        const url = new URL("https://www.itemfix.com/c/memes");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL [video]", async () => {
        const url = new URL("https://www.itemfix.com/v?t=lu9eeq");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            file?.startsWith(
                "https://cdn.itemfix.com/2021/May/12" +
                    "/ItemFix-dot-com-ITEMFIX_AD2_1620869275.mp4",
            ),
            `"${file}"?.startsWith(...)`,
        );
    });
});
