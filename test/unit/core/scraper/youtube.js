/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/jsonrpc/kodi.js";
import * as scraper from "../../../../src/core/scraper/youtube.js";

describe("core/scraper/youtube.js", function () {
    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.youtube.com/feed/trending");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });

            const url = new URL("https://www.youtube.com/watch?x=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id", async function () {
            browser.storage.local.set({
                "youtube-playlist": "playlist",
                "youtube-order": "",
            });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=bar&order=&play=1&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube.com/watch?v=foo&list=bar");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id even with playlist option", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it isn't a video from mobile", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://m.youtube.com/watch?a=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video id from mobile", async function () {
            browser.storage.local.set({ "youtube-playlist": "playlist" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://m.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it isn't a video from music", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });

            const url = new URL("https://music.youtube.com/watch?m=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return video id from music", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

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

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from invidio.us", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://invidio.us/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from hooktube", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://hooktube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to youtube", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([
                    "plugin.video.sendtokodi",
                    "plugin.video.tubed",
                    "plugin.video.youtube",
                ]);

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to tubed", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi", "plugin.video.tubed"]);

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id to sendtokodi", async function () {
            browser.storage.local.set({ "youtube-playlist": "video" });
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://www.youtube.com/watch?v=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractVideo(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/" +
                    "?https://www.youtube.com/watch?v=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractPlaylist()", function () {
        it("should return undefined when it isn't a playlist", async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const url = new URL("https://www.youtube.com/playlist?v=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return undefined when it isn't a playlist from mobile", async function () {
            browser.storage.local.set({ "youtube-order": "reverse" });

            const url = new URL(
                "https://m.youtube.com/playlist?video=foo&incognito=false",
            );
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(file, undefined);
        });

        it("should return playlist id from mobile", async function () {
            browser.storage.local.set({ "youtube-order": "reverse" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://m.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=reverse&play=1&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return playlist id to youtube", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([
                    "plugin.video.sendtokodi",
                    "plugin.video.tubed",
                    "plugin.video.youtube",
                ]);

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return playlist id to tubed", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi", "plugin.video.tubed"]);

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.tubed/?mode=play&playlist_id=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return playlist id to sendtokodi", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon
                .stub(kodi.addons, "getAddons")
                .resolves(["plugin.video.sendtokodi"]);

            const url = new URL("https://www.youtube.com/playlist?list=foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractPlaylist(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.sendtokodi/?" +
                    "https://www.youtube.com/playlist?list=foo",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractEmbed()", function () {
        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id without cookie", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube-nocookie.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from short", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://www.youtube.com/shorts/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from short and URL without 'www'", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://youtube.com/shorts/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from invidio.us", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://invidio.us/embed/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from hooktube", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://hooktube.com/embed/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return video id from DevTube", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://dev.tube/video/foo");
            const metadata = undefined;
            const context = { incognito: true };

            const file = await scraper.extractEmbed(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extractMinify()", function () {
        it("should return video id", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const url = new URL("https://youtu.be/foo");
            const metadata = undefined;
            const context = { incognito: false };

            const file = await scraper.extractMinify(url, metadata, context);
            assert.equal(
                file,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });
});
