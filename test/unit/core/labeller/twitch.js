import assert from "node:assert";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/twitch.js";

describe("core/labeller/twitch.js", function () {
    describe("extractLive()", function () {
        it("should return live label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <title>bar - Twitch</title>
                   </head>
                 </html>`,
            ));

            const channelName = "foo";

            const label = await labeller.extractLive(channelName);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/foo",
            ]);

            stub.restore();
        });
    });

    describe("extractVideo()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <title>bar - baz sur Twitch</title>
                   </head>
                 </html>`,
            ));

            const videoId = "foo";

            const label = await labeller.extractVideo(videoId);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://m.twitch.tv/videos/foo",
            ]);

            stub.restore();
        });
    });

    describe("extractClip()", function () {
        it("should return clip label", async function () {
            const clipId = "foo";

            const label = await labeller.extractClip(clipId);
            assert.strictEqual(label, clipId);
        });
    });
});
