import assert      from "assert";
import { URL }     from "url";
import { extract } from "../../../src/core/index.js";
import { rules }   from "../../../src/core/scraper/mixer.js";

describe("scraper/mixer", function () {
    describe("#patterns", function () {
        it("should return the URL when it's a unsupported URL",
                                                             async function () {
            const url = "https://dev.mixer.com/guides/core/introduction";

            const file = await extract(url);
            assert.strictEqual(file, url);
        });
    });

    describe("*://mixer.com/*", function () {
        let action;
        before(function () {
            action = [...rules.entries()]
                          .find(([r]) => r.includes(this.test.parent.title))[1];
        });

        it("should return null when it's not a video", async function () {
            const url = "https://mixer.com/pro";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return null when it's invalid URL", async function () {
            const url = "https://mixer.com/not/found";
            const expected = null;

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL", async function () {
            const url = "https://mixer.com/NINJA";
            const expected = "https://mixer.com/api/v1/channels/90571077" +
                                                               "/manifest.m3u8";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL when protocol is HTTP", async function () {
            const url = "http://mixer.com/ChannelOne";
            const expected = "https://mixer.com/api/v1/channels/58717" +
                                                               "/manifest.m3u8";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });

        it("should return video URL from embed video", async function () {
            const url = "https://mixer.com/embed/player/LevelUpCast" +
                                                         "?disableLowLatency=1";
            const expected = "https://mixer.com/api/v1/channels/15808052" +
                                                               "/manifest.m3u8";

            const file = await action(new URL(url));
            assert.strictEqual(file, expected);
        });
    });
});
