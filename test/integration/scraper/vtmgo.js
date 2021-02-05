import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: VTM GO", function () {
    it("should return video UUID from episode", async function () {
        const url = new URL("https://vtm.be/vtmgo/afspelen" +
                                      "/eb126a07d-ee7d-48a5-9bf5-b2eac8ced615");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/episodes" +
                                       "/b126a07d-ee7d-48a5-9bf5-b2eac8ced615");
    });

    it("should return video UUID from movie", async function () {
        const url = new URL("https://vtm.be/vtmgo/afspelen" +
                                      "/m10d744fc-bf08-4ff0-9c54-f4a014789584");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/movies" +
                                       "/10d744fc-bf08-4ff0-9c54-f4a014789584");
    });

    it("should return video UUID from movie page", async function () {
        const url = new URL("https://vtm.be/vtmgo" +
                                "/pippa~m5566ccf0-9b9a-4e61-9d2f-3f2f4793ffde");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file,
            "plugin://plugin.video.vtm.go/play/catalog/movies" +
                                       "/5566ccf0-9b9a-4e61-9d2f-3f2f4793ffde");
    });
});
