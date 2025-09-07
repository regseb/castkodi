/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/youtube.js";

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
const TUBED_ADDON = {
    addonid: "plugin.video.tubed",
    author: "anxdpanic",
    type: "xbmc.python.pluginsource",
};
const YOUTUBE_ADDON = {
    addonid: "plugin.video.youtube",
    author: "anxdpanic, bromix, MoojMidge",
    type: "xbmc.python.pluginsource",
};
const INVIDIOUS_ADDON = {
    addonid: "plugin.video.invidious",
    author: "lekma",
    type: "xbmc.python.pluginsource",
};

describe("core/scraper/youtube.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.youtube.com/feed/trending");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            await browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("https://www.youtube.com/watch?x=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id", async function () {
            await browser.storage.local.set({
                "youtube-playlist": "playlist",
                "youtube-order": "",
            });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=bar&order=&play=1&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id even with playlist option", async function () {
            await browser.storage.local.set({ "youtube-playlist": "playlist" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't a video from mobile", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://m.youtube.com/watch?a=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video id from mobile", async function () {
            await browser.storage.local.set({ "youtube-playlist": "playlist" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://m.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't a video from music", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://music.youtube.com/watch?m=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video id from music", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL(
                "https://music.youtube.com/watch?v=foo&list=bar",
            );
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from invidio.us", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://invidio.us/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to youtube", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    SENDTOKODI_ADDON,
                    TUBED_ADDON,
                    YOUTUBE_ADDON,
                    INVIDIOUS_ADDON,
                ]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to tubed", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    SENDTOKODI_ADDON,
                    TUBED_ADDON,
                    INVIDIOUS_ADDON,
                ]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to invidious", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON, INVIDIOUS_ADDON]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.invidious/?action=play&videoId=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to sendtokodi", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.youtube.com/watch?v=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to youtube by default", async function () {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractPlaylist()", function () {
        it("should return undefined when it isn't a playlist", async function () {
            await browser.storage.local.set({ "youtube-order": "" });

            const url = new URL("https://www.youtube.com/playlist?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id", async function () {
            await browser.storage.local.set({ "youtube-order": "" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't a playlist from mobile", async function () {
            await browser.storage.local.set({ "youtube-order": "reverse" });

            const url = new URL(
                "https://m.youtube.com/playlist?video=foo&incognito=false",
            );
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id from mobile", async function () {
            await browser.storage.local.set({ "youtube-order": "reverse" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://m.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=reverse&play=1&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return playlist id to youtube", async function () {
            await browser.storage.local.set({ "youtube-order": "" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON, TUBED_ADDON, YOUTUBE_ADDON]),
            );

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return playlist id to tubed", async function () {
            await browser.storage.local.set({ "youtube-order": "" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON, TUBED_ADDON]),
            );

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.tubed/?mode=play&playlist_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return playlist id to sendtokodi", async function () {
            await browser.storage.local.set({ "youtube-order": "" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?" +
                    "https://www.youtube.com/playlist?list=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return playlist id to youtube by default", async function () {
            await browser.storage.local.set({ "youtube-order": "" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractEmbed()", function () {
        it("should return video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id without cookie", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube-nocookie.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from short", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/shorts/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from short and URL without 'www'", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://youtube.com/shorts/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from invidio.us", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://invidio.us/embed/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from DevTube", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://dev.tube/video/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractClip()", function () {
        it("should return clip id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/clip/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractClip(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/uri2addon/" +
                    "?uri=https%3A%2F%2Fwww.youtube.com%2Fclip%2Ffoo" +
                    "&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip id to youtube", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON, TUBED_ADDON, YOUTUBE_ADDON]),
            );

            const url = new URL("https://www.youtube.com/clip/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractClip(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/uri2addon/" +
                    "?uri=https%3A%2F%2Fwww.youtube.com%2Fclip%2Ffoo" +
                    "&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip id to sendtokodi", async function () {
            await browser.storage.local.set({ "youtube-order": "" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.youtube.com/clip/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractClip(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?" +
                    "https://www.youtube.com/clip/foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return clip id to youtube by default", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([OTHER_ADDON]),
            );

            const url = new URL("https://www.youtube.com/clip/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractClip(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/uri2addon/" +
                    "?uri=https%3A%2F%2Fwww.youtube.com%2Fclip%2Ffoo" +
                    "&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractMinify()", function () {
        it("should return video id", async function () {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://youtu.be/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractMinify(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });
});
