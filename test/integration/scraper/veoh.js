import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Veoh", function () {
    it("should return URL when it's a unsupported URL", async function () {
        const url = "https://www.veoh.com/list-c/Funny-Or-Die---The-Crypt";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return URL when page doesn't exist", async function () {
        const url = "https://www.veoh.com/watch/A1b2C3";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return URL when there isn't video", async function () {
        const url = "https://www.veoh.com/watch/v52936940QEbxjapF";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://www.veoh.com/watch/v141918964qPaACxYC";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://redirect.veoh.com/flash/p/2" +
                                           "/v141918964qPaACxYC/h141918964.mp4";

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });
});
