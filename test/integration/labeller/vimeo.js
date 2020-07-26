import assert       from "assert";
import { extract }  from "../../../src/core/scrapers.js";
import { complete } from "../../../src/core/labellers.js";

describe("Labeller: Vimeo", function () {
    it("should return video label", async function () {
        const url = new URL("https://vimeo.com/265045525");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({ file, label: "play", type: "unknown" });
        assert.deepStrictEqual(item, {
            file,
            label: "Looking For Something",
            type:  "unknown",
        });
    });
});
