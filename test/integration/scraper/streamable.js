import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Streamable", function () {
    it("should return video URL", async function () {
        const url = "https://streamable.com/tapn9";
        const expected = "https://cdn-b-east.streamable.com/video/mp4" +
                                                                  "/tapn9.mp4?";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });
});
