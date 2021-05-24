import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Konbini", function () {
    it("should return URL [iframe-dailymotion]", async function () {
        const url = new URL("https://www.konbini.com/fr/cinema" +
                                                   "/video-8-choses-palmashow");
        const options = { depth: false, incognito: true };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                                  "&url=x81cjw7");
    });
});
