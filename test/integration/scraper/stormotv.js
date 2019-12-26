import assert      from "assert";
import { config }  from "../config.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: StormoTV", function () {
    before(function () {
        if (null !== config.country && "fr" !== config.country) {
            this.skip();
        }
    });

    it("should return video URL", async function () {
        const url = "https://www.stormo.tv/videos/514985" +
                                             "/little-big-rock-paper-scissors/";
        const expected = "/514000/514985/514985_low.mp4/";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.ok(file.endsWith(expected), `"${file}".endsWith(expected)`);
    });
});
