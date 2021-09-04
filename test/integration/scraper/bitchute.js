import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: BitChute", function () {
    it("should return video URL [video]", async function () {
        const url = new URL("https://www.bitchute.com/video/dz5JcCZnJMge/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file?.endsWith(".bitchute.com/hU2elaB5u3kB/dz5JcCZnJMge.mp4"),
                  `"${file}"?.endsWith(...)`);
    });
});
