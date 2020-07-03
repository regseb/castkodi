import assert                 from "assert";
import { extract as scraper } from "../../../src/core/scrapers.js";
import { extract }            from "../../../src/core/labellers.js";

describe("Labeller: Dailymotion", function () {
    it("should return video label", async function () {
        const url = "https://www.dailymotion.com/video/x2knr9t";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "" });
        assert.strictEqual(label,
            "Comment perdre 30 secondes sur Dailymotion ? - Archive INA");
    });
});
