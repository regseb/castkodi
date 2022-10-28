import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/youtube.js";

describe("core/labeller/youtube.js", function () {
    describe("extractVideo()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="foo" />
                   </head>
                 </html>`,
            ));

            const videoId = "bar";

            const label = await labeller.extractVideo(videoId);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=bar",
            ]);
        });

        it("should return unavailable label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head></head>
                 </html>`,
            ));

            const videoId = "foo";

            const label = await labeller.extractVideo(videoId);
            assert.equal(label, "(Video unavailable)");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);
        });
    });

    describe("extractPlaylist()", function () {
        it("should return playlist label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="foo" />
                   </head>
                 </html>`,
            ));

            const playlistId = "bar";

            const label = await labeller.extractPlaylist(playlistId);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=bar",
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

            const playlistId = "foo";

            const label = await labeller.extractPlaylist(playlistId);
            assert.equal(label, "Mix");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);
        });
    });
});
