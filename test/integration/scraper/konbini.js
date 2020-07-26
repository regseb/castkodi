import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Konbini", function () {
    it("should return URL", async function () {
        const url = new URL("https://www.konbini.com/fr/cinema" +
               "/sam-mendes-plonge-lhorreur-tranchees-premier-trailer-de-1917");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.youtube/play/?video_id=gZjQROMAh_s" +
                                                             "&incognito=true");
    });
});
