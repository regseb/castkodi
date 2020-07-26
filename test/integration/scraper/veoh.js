import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Veoh", function () {
    it("should return URL when it's a unsupported URL", async function () {
        const url = new URL("https://www.veoh.com/list-c" +
                                                   "/Funny-Or-Die---The-Crypt");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return URL when page doesn't exist", async function () {
        const url = new URL("https://www.veoh.com/watch/A1b2C3");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return URL when there isn't video", async function () {
        const url = new URL("https://www.veoh.com/watch/v52936940QEbxjapF");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.veoh.com/watch/v141918964qPaACxYC");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.startsWith("https://redirect.veoh.com/flash/p/2" +
                                          "/v141918964qPaACxYC/h141918964.mp4"),
                  `"${file}".startsWith(...)`);
    });
});
