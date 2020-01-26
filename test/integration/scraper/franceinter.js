import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: France Inter", function () {
    it("should return audio URL", async function () {
        const url = "https://www.franceinter.fr/emissions/blockbusters" +
                                            "/blockbusters-19-juillet-2019";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://media.radiofrance-podcast.net/podcast09" +
                                   "/17309-19.07.2019-ITEMA_22112050-0.mp3";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
