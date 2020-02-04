import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: PodMust", function () {
    it("should return URL when it's not an audio", async function () {
        const url = "https://podmust.com/tendances-podcast-2021/";
        const options = { "depth": 0, "incognito": false };
        const expected = url;

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL", async function () {
        const url = "https://podmust.com/podcast/le-billet-de-chris-esquerre/";
        const options = { "depth": 0, "incognito": false };
        const expected = "https://rf.proxycast.org" +
                                       "/c7e40c49-a922-441c-b423-10daeb6b7b6d" +
                                   "/19736-30.01.2020-ITEMA_22269047-0.mp3?_=1";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });

    it("should return audio URL when protocol is HTTP", async function () {
        const url = "http://podmust.com/podcast/oli/";
        const options = { "depth": 0, "incognito": false };
        const expected = "http://rf.proxycast.org/1651466062169907200" +
                                   "/19721-17.12.2019-ITEMA_22232156-6.m4a?_=1";

        const file = await extract(new URL(url), options);
        assert.strictEqual(file, expected);
    });
});
