/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/twitch.js";

describe("core/labeller/twitch.js", function () {
    describe("extractLive()", function () {
        it("should return live label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <title>foo - Twitch</title>
                     </head></html>`,
                ),
            );

            const channelName = "bar";

            const label = await labeller.extractLive(channelName);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["https://m.twitch.tv/bar"]);
        });
    });

    describe("extractVideo()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <title>foo - bar sur Twitch</title>
                     </head></html>`,
                ),
            );

            const videoId = "baz";

            const label = await labeller.extractVideo(videoId);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://m.twitch.tv/videos/baz",
            ]);
        });
    });

    describe("extractClip()", function () {
        it("should return clip label", async function () {
            const clipId = "foo";

            const label = await labeller.extractClip(clipId);
            assert.equal(label, clipId);
        });
    });
});
