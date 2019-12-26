import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: France Inter", function () {
    it("should return audio URL", async function () {
        const url = "https://www.franceinter.fr/emissions/blockbusters" +
                                            "/blockbusters-19-juillet-2019";
        const expected = "https://media.radiofrance-podcast.net/podcast09" +
                                   "/17309-19.07.2019-ITEMA_22112050-0.mp3";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
