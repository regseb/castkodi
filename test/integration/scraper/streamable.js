import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Streamable", function () {
    it("should return video URL [opengraph]", async function () {
        const url = new URL("https://streamable.com/tapn9");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(new URL(file).pathname.endsWith("tapn9.mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
