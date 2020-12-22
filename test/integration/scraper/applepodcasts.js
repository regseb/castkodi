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
                               "/cest-papy-mamie/id1093080425?i=1000435243113");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.startsWith("http://arte.proxycast.org/m/media" +
                                                          "/226026218795.mp3?"),
                  `"${file}".startsWith(...)`);
    });
});
