import assert from "node:assert";
import { extract, extractClip, extractEmbed }
                                  from "../../../../src/core/scraper/twitch.js";

describe("core/scraper/twitch.js", function () {
    describe("extractClip()", function () {
        it("should return null when it's not a clip", async function () {
            const url = new URL("https://clips.twitch.tv/embed?noclip=foo");

            const file = await extractClip(url);
            assert.strictEqual(file, null);
        });

        it("should return embed clip name", async function () {
            const url = new URL("https://clips.twitch.tv/embed?clip=foo");

            const file = await extractClip(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });

        it("should return clip name", async function () {
            const url = new URL("https://clips.twitch.tv/foo");

            const file = await extractClip(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });

        it("should return clip name when protocol is HTTP", async function () {
            const url = new URL("http://clips.twitch.tv/foo");

            const file = await extractClip(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });
    });

    describe("extractEmbed()", function () {
        it("should return null when it's not channel or video",
                                                             async function () {
            const url = new URL("https://player.twitch.tv/?other=foo");

            const file = await extractEmbed(url);
            assert.strictEqual(file, null);
        });

        it("should return channel name", async function () {
            const url = new URL("https://player.twitch.tv/?channel=foo");

            const file = await extractEmbed(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });

        it("should return video id", async function () {
            const url = new URL("https://player.twitch.tv/?video=12345");

            const file = await extractEmbed(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&video_id=12345");
        });
    });

    describe("extract()", function () {
        it("should return null when it's a unsupported URL", async function () {
            const url = new URL("https://app.twitch.tv/download");

            const file = await extract(url);
            assert.strictEqual(file, null);
        });

        it("should return video id", async function () {
            const url = new URL("https://www.twitch.tv/videos/12345");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&video_id=12345");
        });

        it("should return video id when protocol is HTTP", async function () {
            const url = new URL("http://www.twitch.tv/videos/12345");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&video_id=12345");
        });

        it("should return video id from 'go'", async function () {
            const url = new URL("https://go.twitch.tv/videos/12345");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&video_id=12345");
        });

        it("should return video id from mobile version", async function () {
            const url = new URL("https://m.twitch.tv/videos/12345");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&video_id=12345");
        });

        it("should return clip name", async function () {
            const url = new URL("https://www.twitch.tv/twitch/clip/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });

        it("should return clip name when protocol is HTTP", async function () {
            const url = new URL("http://www.twitch.tv/twitch/clip/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });

        it("should return clip name from 'go'", async function () {
            const url = new URL("https://go.twitch.tv/twitch/clip/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });

        it("should return clip name from mobile version", async function () {
            const url = new URL("https://m.twitch.tv/twitch/clip/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });

        it("should return channel name from moderator URL", async function () {
            const url = new URL("http://www.twitch.tv/moderator/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });

        it("should return channel name", async function () {
            const url = new URL("https://www.twitch.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });

        it("should return channel name when protocol is HTTP",
                                                             async function () {
            const url = new URL("http://www.twitch.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });

        it("should return channel name form 'go'", async function () {
            const url = new URL("https://go.twitch.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });

        it("should return channel name from mobile version", async function () {
            const url = new URL("https://m.twitch.tv/foo");

            const file = await extract(url);
            assert.strictEqual(file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });
    });
});
