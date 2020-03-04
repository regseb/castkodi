import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: LiveLeak", function () {
    it("should return video URL", async function () {
        const url = "https://www.liveleak.com/view?t=HfVq_1535497667";
        const options = { depth: 0, incognito: false };
        const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/Aug/28/" +
                  "LiveLeak-dot-com-Untitled_1535497475.wmv.5b85d54bbb2dd.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });

    it("should return video URL even when URL contains 'mp4'",
                                                             async function () {
        const url = "https://www.liveleak.com/view?t=Cmp4X_1539969642";
        const options = { depth: 0, incognito: false };
        const expected = "https://cdn.liveleak.com/80281E/ll_a_s/2018/Oct/19/" +
                  "LiveLeak-dot-com-LaunchPadWaterDelugeSystemTestatNASAKenn_" +
                                            "1539969608.mp4.5bca1334cea29.mp4?";

        const file = await extract(new URL(url), options);
        assert.ok(file.startsWith(expected), `"${file}".startsWith(expected)`);
    });
});
