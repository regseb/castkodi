import assert      from "assert";
import { extract } from "../../../../src/core/scraper/mixer.js";

describe("core/scraper/mixer.js", function () {
    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = "https://dev.mixer.com/guides/core/introduction";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's not a video", async function () {
            const url = "https://mixer.com/pro";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's invalid URL", async function () {
            const url = "https://mixer.com/not/found";
            const expected = null;

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://mixer.com/NINJA";
            const expected = "https://mixer.com/api/v1/channels/90571077" +
                                                               "/manifest.m3u8";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://mixer.com/ChannelOne";
            const expected = "https://mixer.com/api/v1/channels/58717" +
                                                               "/manifest.m3u8";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL from embed video", async function () {
            const url = "https://mixer.com/embed/player/LevelUpCast" +
                                                         "?disableLowLatency=1";
            const expected = "https://mixer.com/api/v1/channels/15808052" +
                                                               "/manifest.m3u8";

            const file = await extract(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
