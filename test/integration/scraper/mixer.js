import assert      from "assert";
import { extract } from "../../../src/core/scrapers.js";

describe("Scraper: Mixer", function () {
    it("should return URL when it's not a video", async function () {
        const url = "https://mixer.com/pro";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return null URL it's invalid URL", async function () {
        const url = "https://mixer.com/not/found";
        const expected = url;

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL", async function () {
        const url = "https://mixer.com/NINJA";
        const expected = "https://mixer.com/api/v1/channels/90571077" +
                                                               "/manifest.m3u8";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = "http://mixer.com/ChannelOne";
        const expected = "https://mixer.com/api/v1/channels/58717" +
                                                               "/manifest.m3u8";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });

    it("should return video URL from embed video", async function () {
        const url = "https://mixer.com/embed/player/LevelUpCast" +
                                                         "?disableLowLatency=1";
        const expected = "https://mixer.com/api/v1/channels/15808052" +
                                                               "/manifest.m3u8";

        const file = await extract(new URL(url), { "depth": 0 });
        assert.strictEqual(file, expected);
    });
});
