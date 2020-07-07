import assert       from "assert";
import { extract }  from "../../../src/core/scrapers.js";
import { complete } from "../../../src/core/labellers.js";

describe("Labeller: Dailymotion", function () {
    it("should return video label", async function () {
        const url = "https://www.dailymotion.com/video/x2knr9t";
        const options = { depth: false, incognito: false };

        const file = await extract(new URL(url), options);
        const item = await complete({ file, label: "", type: "unknown" });
        assert.deepStrictEqual(item, {
            file,
            label: "Comment perdre 30 secondes sur Dailymotion ? - Archive INA",
            type:  "unknown",
        });
    });
});
