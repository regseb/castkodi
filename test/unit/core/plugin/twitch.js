import assert from "node:assert";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/twitch.js";

describe("core/plugin/twitch.js", function () {
    describe("generateLiveUrl()", function () {
        it("should return URL with channel name", async function () {
            const label = await plugin.generateLiveUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo");
        });
    });

    describe("generateVideoUrl()", function () {
        it("should return URL with video id", async function () {
            const label = await plugin.generateVideoUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo");
        });
    });

    describe("generateClipUrl()", function () {
        it("should return URL with clip id", async function () {
            const label = await plugin.generateClipUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.twitch/?mode=play&slug=foo");
        });
    });

    describe("extract()", function () {
        it("should return null when there isn't parameter", async function () {
            const url = new URL("plugin://plugin.video.twitch/");

            const label = await plugin.extract(url);
            assert.strictEqual(label, null);
        });

        it("should return live label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <title>foo - Twitch</title>
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.twitch/" +
                                                           "?channel_name=bar");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/bar",
            ]);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <title>foo - bar sur Twitch</title>
                   </head>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.twitch/?video_id=baz");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/videos/baz",
            ]);
        });

        it("should return clip label", async function () {
            const url = new URL("plugin://plugin.video.twitch/?slug=foo");

            const label = await plugin.extract(url);
            assert.strictEqual(label, "foo");
        });
    });
});
