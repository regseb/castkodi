import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: ItemFix", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.itemfix.com/c/memes");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL [video]", async function () {
        const url = new URL("https://www.itemfix.com/v?t=lu9eeq");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.startsWith("https://cdn.itemfix.com/2021/May/12" +
                                 "/ItemFix-dot-com-ITEMFIX_AD2_1620869275.mp4"),
                  `"${file}"?.startsWith(...)`);
    });
});
