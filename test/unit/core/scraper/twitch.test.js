/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/twitch.js";
import "../../setup.js";

const OTHER_ADDON = {
    addonid: "plugin.video.other",
    author: "johndoe",
    type: "xbmc.python.pluginsource",
};
const SENDTOKODI_ADDON = {
    addonid: "plugin.video.sendtokodi",
    author: "firsttris",
    type: "xbmc.python.pluginsource",
};
const TWITCH_ADDON = {
    addonid: "plugin.video.twitch",
    author: "anxdpanic, A Talented Community",
    type: "xbmc.python.pluginsource",
};

describe("core/scraper/twitch.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extractClip()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://appeals.twitch.tv/");

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return embed clip slug", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://clips.twitch.tv/embed?clip=foo");

            const file = await scraper.extractClip(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't a clip", async () => {
            const url = new URL("https://clips.twitch.tv/embed?noclip=foo");

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return clip slug", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://clips.twitch.tv/foo");

            const file = await scraper.extractClip(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractEmbed()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://clips.twitch.tv/");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });

        it("should return channel name", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://player.twitch.tv/?channel=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://player.twitch.tv/?video=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't channel or video", async () => {
            const url = new URL("https://player.twitch.tv/?other=foo");

            const file = await scraper.extractEmbed(url);
            assert.equal(file, undefined);
        });
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://app.twitch.tv/download");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video id", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from 'go'", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://go.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from mobile version", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://m.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to twitch", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([TWITCH_ADDON, SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video URL to sendtokodi", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.twitch.tv/videos/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to twitch by default", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/videos/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip slug", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip slug from 'go'", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://go.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip slug from mobile version", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://m.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip slug to twitch", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([TWITCH_ADDON, SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip URL to sendtokodi", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://clips.twitch.tv/bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip slug to twitch by default", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/foo/clip/bar");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&slug=bar",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel name from moderator URL", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.twitch.tv/moderator/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel name", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel name from 'go'", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://go.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel name from mobile version", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://m.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel name to twitch", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([TWITCH_ADDON, SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel URL to sendtokodi", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?https://www.twitch.tv/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return channel name to twitch by default", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.twitch.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(
                file,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
