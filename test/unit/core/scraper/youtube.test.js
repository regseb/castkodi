/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/youtube.js";
import { restoreAll } from "../../../polyfill/browser.js";
import "../../setup.js";

const INVIDIOUS_LEKMA_ADDON = {
    addonid: "plugin.video.invidious",
    author: "lekma",
    type: "xbmc.python.pluginsource",
};
const INVIDIOUS_PETTERREINHOLDTSEN_ADDON = {
    addonid: "plugin.video.invidious",
    author: "petterreinholdtsen",
    type: "xbmc.python.pluginsource",
};
const OTHER_ADDON = {
    addonid: "plugin.video.other",
    author: "lekma",
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

describe("core/scraper/youtube.js", () => {
    afterEach(() => {
        mock.reset();
        restoreAll();
    });

    describe("extractSearch()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL(
                "https://www.youtube.com/feed/subscriptions?v=foo",
            );
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            await browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("https://www.youtube.com/watch?x=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id", async () => {
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

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=bar&order=&play=1&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id even with playlist option", async () => {
            await browser.storage.local.set({ "youtube-playlist": "playlist" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't a video from mobile", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://m.youtube.com/watch?a=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video id from mobile", async () => {
            await browser.storage.local.set({ "youtube-playlist": "playlist" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://m.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return undefined when it isn't a video from music", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://music.youtube.com/watch?m=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video id from music", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL(
                "https://music.youtube.com/watch?v=foo&list=bar",
            );
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from YouTube Kids", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtubekids.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to youtube", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    INVIDIOUS_LEKMA_ADDON,
                    SENDTOKODI_ADDON,
                    TUBED_ADDON,
                    YOUTUBE_ADDON,
                ]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to tubed", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    INVIDIOUS_LEKMA_ADDON,
                    SENDTOKODI_ADDON,
                    TUBED_ADDON,
                ]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to invidious", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([INVIDIOUS_LEKMA_ADDON, SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.invidious/?action=play&videoId=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to sendtokodi", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([SENDTOKODI_ADDON]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.youtube.com/watch?v=foo",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id to youtube by default", async () => {
            await browser.storage.local.set({ "youtube-playlist": "video" });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([
                    INVIDIOUS_PETTERREINHOLDTSEN_ADDON,
                    OTHER_ADDON,
                ]),
            );

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractSearch(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractPlaylist()", () => {
        it("should return undefined when it isn't a playlist", async () => {
            await browser.storage.local.set({ "youtube-order": "" });

            const url = new URL("https://www.youtube.com/playlist?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id", async () => {
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

        it("should return undefined when it isn't a playlist from mobile", async () => {
            await browser.storage.local.set({ "youtube-order": "reverse" });

            const url = new URL(
                "https://m.youtube.com/playlist?video=foo&incognito=false",
            );
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id from mobile", async () => {
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

        it("should return playlist id to youtube", async () => {
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

        it("should return playlist id to tubed", async () => {
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

        it("should return playlist id to sendtokodi", async () => {
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

        it("should return playlist id to youtube by default", async () => {
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

    describe("extractPath()", () => {
        it("should return video id", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id without cookie", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube-nocookie.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from short", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/shorts/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from short and URL without 'www'", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://youtube.com/shorts/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from URL minify", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://youtu.be/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from live", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://www.youtube.com/live/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from podcast", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://music.youtube.com/podcast/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should return video id from DevTube", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            const url = new URL("https://dev.tube/video/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractPath(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });
    });

    describe("extractClip()", () => {
        it("should return clip id", async () => {
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

        it("should return clip id to youtube", async () => {
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

        it("should return clip id to sendtokodi", async () => {
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

        it("should return clip id to youtube by default", async () => {
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
});
