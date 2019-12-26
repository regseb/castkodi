import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Mixcloud", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://www.mixcloud.com/discover/jazz/";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id", async function () {
        const url = "https://www.mixcloud.com" +
                                        "/LesGar%C3%A7onsBienElev%C3%A9s/n101/";
        const expected = "plugin://plugin.audio.mixcloud/?mode=40" +
                              "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s" +
                                                                   "%2Fn101%2F";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return audio id when protocol is HTTP", async function () {
        const url = "http://www.mixcloud.com" +
                                        "/LesGar%C3%A7onsBienElev%C3%A9s/n101/";
        const expected = "plugin://plugin.audio.mixcloud/?mode=40" +
                              "&key=%2FLesGar%25C3%25A7onsBienElev%25C3%25A9s" +
                                                                   "%2Fn101%2F";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
