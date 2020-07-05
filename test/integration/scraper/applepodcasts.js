import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Apple Podcasts", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://podcasts.apple.com/us/podcast/culture-1999/id";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, url);
    });

    it("should return audio URL", async function () {
        const url = "https://podcasts.apple.com/fr/podcast" +
                                "/cest-papy-mamie/id1093080425?i=1000435243113";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        assert.strictEqual(file,
            "https://dts.podtrac.com/redirect.mp3" +
                               "/www.arteradio.com/podcast_sound/61661310.mp3");
    });
});
