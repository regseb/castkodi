import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Streamable", function () {
    it("should return video URL", async function () {
        const url = "https://streamable.com/tapn9";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith("https://cdn-b-east.streamable.com/video" +
                                                             "/mp4/tapn9.mp4?"),
                  `"${file}".startsWith(...)`);
    });
});
