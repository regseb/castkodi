import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Apple Podcasts", function () {
    it("should return URL when it's not an audio", async function () {
        const url = new URL("https://podcasts.apple.com/us/podcast" +
                                                            "/culture-1999/id");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return audio URL", async function () {
        const url = new URL("https://podcasts.apple.com/fr/podcast" +
                             "/les-infos-de-07h00-du-vendredi-01-janvier-2021" +
                                               "/id1041742167?i=1000504035248");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "http://rf.proxycast.org/225d33fa-b601-4c07-a44b-a7485ae504dd" +
                        "/14929-01.01.2021-ITEMA_22528945-2021B20133S0001.mp3");
    });
});
