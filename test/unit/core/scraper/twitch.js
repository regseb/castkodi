/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as scraper from "../../../../src/core/scraper/twitch.js";

describe("core/scraper/twitch.js", function () {
    describe("extractClip()", function () {
        it("should return undefined when it isn't a clip", async function () {
            const url = new URL("https://clips.twitch.tv/embed?noclip=foo");

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return embed clip name", async function () {
            const url = new URL("https://clips.twitch.tv/embed?clip=foo");

            const file = await scraper.extractClip(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });

        it("should return clip name", async function () {
            const url = new URL("https://clips.twitch.tv/foo");

            const file = await scraper.extractClip(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });
    });

    describe("extractEmbed()", function () {
        it("should return undefined when it isn't channel or video", async function () {
            const url = new URL("https://player.twitch.tv/?other=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });

        it("should return channel name", async function () {
            const url = new URL("https://player.twitch.tv/?channel=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });

        it("should return video id", async function () {
            const url = new URL("https://player.twitch.tv/?video=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );
        });
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://app.twitch.tv/download");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async function () {
            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );
        });

        it("should return video id from 'go'", async function () {
            const url = new URL("https://go.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );
        });

        it("should return video id from mobile version", async function () {
            const url = new URL("https://m.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );
        });

        it("should return clip name", async function () {
            const url = new URL("https://www.twitch.tv/twitch/clip/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });

        it("should return clip name from 'go'", async function () {
            const url = new URL("https://go.twitch.tv/twitch/clip/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });

        it("should return clip name from mobile version", async function () {
            const url = new URL("https://m.twitch.tv/twitch/clip/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });

        it("should return channel name from moderator URL", async function () {
            const url = new URL("http://www.twitch.tv/moderator/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });

        it("should return channel name", async function () {
            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });

        it("should return channel name from 'go'", async function () {
            const url = new URL("https://go.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });

        it("should return channel name from mobile version", async function () {
            const url = new URL("https://m.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });
    });
});
