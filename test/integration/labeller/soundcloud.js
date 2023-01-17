import assert from "node:assert/strict";
import { complete } from "../../../src/core/labellers.js";
import { extract } from "../../../src/core/scrapers.js";

describe("Labeller: SoundCloud", function () {
    it("should return audio label", async function () {
        const url = new URL("https://soundcloud.com/esa/hear-the-lightning");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "play",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepEqual(item, {
            file,
            label:    "Hear the lightning",
            position: 0,
            title:    "",
            type:     "unknown",
        });
    });

    it("should return set label", async function () {
        const url = new URL("https://soundcloud.com/esa/sets/news-views");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "play",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepEqual(item, {
            file,
            label:    "News & Views",
            position: 0,
            title:    "",
            type:     "unknown",
        });
    });

    it("should return dynamic set label", async function () {
        const url = new URL("https://soundcloud.com/discover/sets" +
                            "/charts-top:alternativerock");
        const options = { depth: false, incognito: false };

        const file = await extract(url, options);
        const item = await complete({
            file,
            label:    "play",
            position: 0,
            title:    "",
            type:     "unknown",
        });
        assert.deepEqual(item, {
            file,
            label:    "Top 50: Alternative Rock",
            position: 0,
            title:    "",
            type:     "unknown",
        });
    });
});
