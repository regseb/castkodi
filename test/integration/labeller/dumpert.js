import assert from "node:assert";
import { extract } from "../../../src/core/scrapers.js";
import { complete } from "../../../src/core/labellers.js";

describe("Labeller: Dumpert", function () {
    it("should return video label", async function () {
        const url = new URL("https://www.dumpert.nl/item/7924631_3a727e30");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({ file, label: "", type: "unknown" });
        assert.deepStrictEqual(item, {
            file,
            label: "Dolfijn is metalhead",
            type:  "unknown",
        });
    });
});
