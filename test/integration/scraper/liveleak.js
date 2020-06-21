import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: LiveLeak", function () {
    it("should return video URL [video]", async function () {
        const url = "https://www.liveleak.com/view?t=HfVq_1535497667";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });

    it("should return video URL even when URL contains 'mp4' [video]",
                                                             async function () {
        const url = "https://www.liveleak.com/view?t=Cmp4X_1539969642";
        const options = { depth: 0, incognito: false };

        const file = await extract(new URL(url), options);
        assert.ok(new URL(file).pathname.endsWith(".mp4"),
                  `new URL("${file}").pathname.endsWith(...)`);
    });
});
