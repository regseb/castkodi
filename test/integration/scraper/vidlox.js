import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Vidlox", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://vidlox.me/faq";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return video URL", async function () {
        const url = "https://vidlox.me/30fxi9o50b3v";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.endsWith("/master.m3u8"), `"${file}".endsWith(...)`);
    });
});
