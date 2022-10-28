import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../../src/core/kodi.js";
import * as plugin from "../../../../src/core/plugin/youtube.js";

describe("core/plugin/youtube.js", function () {
    describe("generateVideoUrl()", function () {
        it("should return YouTube URL when no addon", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const label = await plugin.generateVideoUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                   "&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL when two addons", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.tubed", "plugin.video.youtube",
            ]);

            const label = await plugin.generateVideoUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                   "&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL when one addon", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.youtube",
            ]);

            const label = await plugin.generateVideoUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                   "&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL with incognito", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const label = await plugin.generateVideoUrl("foo", true);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                   "&incognito=true");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return Tubed URL when one addon", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.tubed",
            ]);

            const label = await plugin.generateVideoUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("generatePlaylistUrl()", function () {
        it("should return YouTube URL when no addon", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo&order=" +
                                                   "&play=1&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL when two addons", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.tubed", "plugin.video.youtube",
            ]);

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo&order=" +
                                                   "&play=1&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL when one addons", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.youtube",
            ]);

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo&order=" +
                                                   "&play=1&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL with incognito", async function () {
            browser.storage.local.set({ "youtube-order": "" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const label = await plugin.generatePlaylistUrl("foo", true);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo&order=" +
                                                   "&play=1&incognito=true");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return YouTube URL with default order", async function () {
            browser.storage.local.set({ "youtube-order": "default" });
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([]);

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo" +
                                                   "&order=default&play=1" +
                                                   "&incognito=false");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });

        it("should return Tubed URL when one addons", async function () {
            const stub = sinon.stub(kodi.addons, "getAddons").resolves([
                "plugin.video.tubed",
            ]);

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(label,
                "plugin://plugin.video.tubed/?mode=play&playlist_id=foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["video"]);
        });
    });

    describe("extract()", function () {
        it("should return undefined when there isn't parameter from YouTube",
                                                             async function () {
            const url = new URL("plugin://plugin.video.youtube/play/");

            const label = await plugin.extract(url);
            assert.equal(label, undefined);
        });

        it("should return undefined when there isn't parameter from Tubed",
                                                             async function () {
            const url = new URL("plugin://plugin.video.tubed/" +
                                                          "?mode=play&foo=bar");

            const label = await plugin.extract(url);
            assert.equal(label, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.youtube/play/" +
                                                               "?video_id=foo");

            const label = await plugin.extract(url);
            assert.equal(label, "bar");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);
        });

        it("should return unavailable label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head></head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.tubed/" +
                                                     "?mode=play&video_id=foo");

            const label = await plugin.extract(url);
            assert.equal(label, "(Video unavailable)");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);
        });

        it("should return playlist label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.tubed/" +
                                                  "?mode=play&playlist_id=foo");

            const label = await plugin.extract(url);
            assert.equal(label, "bar");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);
        });

        it("should return mix label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="null" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.youtube/play/" +
                                                            "?playlist_id=foo");

            const label = await plugin.extract(url);
            assert.equal(label, "Mix");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);
        });
    });
});
