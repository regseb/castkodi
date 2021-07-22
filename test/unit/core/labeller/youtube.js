import assert from "node:assert";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/youtube.js";

describe("core/labeller/youtube.js", function () {
    describe("extractVideo()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const videoId = "foo";

            const label = await labeller.extractVideo(videoId);
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

            const videoId = "foo";

            const label = await labeller.extractVideo(videoId);
            assert.strictEqual(label, "(Video unavailable)");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/watch?v=foo",
            ]);

            stub.restore();
        });
    });

    describe("extractPlaylist()", function () {
        it("should return playlist label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const playlistId = "foo";

            const label = await labeller.extractPlaylist(playlistId);
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

            const playlistId = "foo";

            const label = await labeller.extractPlaylist(playlistId);
            assert.strictEqual(label, "Mix");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);

            stub.restore();
        });
    });
});
