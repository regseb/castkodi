import assert                 from "assert";
import { extract as scraper } from "../../../src/core/scrapers.js";
import { extract }            from "../../../src/core/labellers.js";

describe("Labeller: Dumpert", function () {
    it("should return video label", async function () {
        const url = "https://www.dumpert.nl/item/7924631_3a727e30";
        const options = { depth: 0, incognito: false };

        const file = await scraper(new URL(url), options);
        const label = await extract({ file, label: "", type: "unknown" });
        assert.strictEqual(label, "Dolfijn is metalhead");
    });
});
