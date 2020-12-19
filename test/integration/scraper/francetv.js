import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: France tv", function () {
    it("should return URL when it's not a video", async function () {
        const url = new URL("https://www.france.tv/spectacles-et-culture/");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.strictEqual(file, url.href);
    });

    it("should return video URL", async function () {
        const url = new URL("https://www.france.tv/france-2/journal-20h00" +
                                                 "/1133923-journal-20h00.html");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        assert.ok(file.startsWith("https://replayftv-vh.akamaihd.net/i" +
                                            "/streaming-adaptatif/2020/S01/J3" +
                                         "/220156965-5e0cf4f0c0f35-,standard1" +
                                    ",standard2,standard3,standard4,standard5" +
                                                     ",.mp4.csmil/master.m3u8"),
                  `"${file}".startsWith(...)`);
    });
});
