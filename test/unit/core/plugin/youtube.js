import assert from "node:assert";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/youtube.js";

describe("core/plugin/youtube.js", function () {
    describe("generateVideoUrl()", function () {
        it("should return URL with video id", async function () {
            const label = await plugin.generateVideoUrl("foo", false);
            assert.strictEqual(label,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                            "&incognito=false");
        });

        it("should return URL with video id in incognito", async function () {
            const label = await plugin.generateVideoUrl("foo", true);
            assert.strictEqual(label,
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                             "&incognito=true");
        });
    });

    describe("generatePlaylistUrl()", function () {
        it("should return URL with playlist id", async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.strictEqual(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo" +
                                              "&order=&play=1&incognito=false");

            browser.storage.local.clear();
        });

        it("should return URL with playlist id in incognito",
                                                             async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const label = await plugin.generatePlaylistUrl("foo", true);
            assert.strictEqual(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo" +
                                               "&order=&play=1&incognito=true");

            browser.storage.local.clear();
        });

        it("should return URL with playlist id in default order",
                                                             async function () {
            browser.storage.local.set({ "youtube-order": "default" });

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.strictEqual(label,
                "plugin://plugin.video.youtube/play/?playlist_id=foo" +
                                       "&order=default&play=1&incognito=false");

            browser.storage.local.clear();
        });
    });

    describe("extract()", function () {
        it("should return null when there isn't parameter", async function () {
            const url = new URL("plugin://plugin.video.youtube/play/");

            const label = await plugin.extract(url);
            assert.strictEqual(label, null);
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
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);

            stub.restore();
        });

        it("should return unavailable label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head></head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.youtube/play/" +
                                                               "?video_id=foo");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "(Video unavailable)");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);

            stub.restore();
        });

        it("should return playlist label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.youtube/play/" +
                                                            "?playlist_id=foo");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);

            stub.restore();
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
            assert.strictEqual(label, "Mix");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);

            stub.restore();
        });
    });
});
