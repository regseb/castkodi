import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Uqload", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://uqload.com/checkfiles.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return URL when video was deleted", async function () {
        const url = new URL("https://uqload.com/k1phujbh3t7d.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://uqload.com/5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file &&
                            file.endsWith("/v.mp4|Referer=https://uqload.com/"),
                  `"${file}".endsWith(...)`);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL("http://uqload.com/5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file &&
                            file.endsWith("/v.mp4|Referer=https://uqload.com/"),
                  `"${file}".endsWith(...)`);
    });

    it("should return video URL from embed", async function () {
        const url = new URL("https://uqload.com/embed-5x0cgygu2bgg.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(undefined !== file &&
                            file.endsWith("/v.mp4|Referer=https://uqload.com/"),
                  `"${file}".endsWith(...)`);
    });
});