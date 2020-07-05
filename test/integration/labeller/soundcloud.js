import assert                 from "assert";
import { extract as scraper } from "../../../src/core/scrapers.js";
import { extract }            from "../../../src/core/labellers.js";

describe("Labeller: SoundCloud", function () {
    it("should return audio label", async function () {
        const url = "https://soundcloud.com/esa/hear-the-lightning";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "play", type: "unknown" });
        assert.strictEqual(label, "Hear the lightning");
    });

    it("should return set label", async function () {
        const url = "https://soundcloud.com/esa/sets/news-views";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "play", type: "unknown" });
        assert.strictEqual(label, "News & Views");
    });

    it("should return default label when it's dynamic set", async function () {
        const url = "https://soundcloud.com/discover/sets" +
                                                  "/charts-top:alternativerock";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "play", type: "unknown" });
        assert.strictEqual(label, "play");
    });
});
