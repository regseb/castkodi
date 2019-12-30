import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Konbini", function () {
    it("should return URL", async function () {
        const url = "https://www.konbini.com/fr/cinema/sam-mendes-plonge" +
                                  "-lhorreur-tranchees-premier-trailer-de-1917";
        const expected = "plugin://plugin.video.youtube/play/" +
                                                        "?video_id=gZjQROMAh_s";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
