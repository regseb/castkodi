import assert from "node:assert";
import sinon from "sinon";
import { extract } from "../../../../src/core/labeller/youtube.js";

describe("core/labeller/youtube.js", function () {
    describe("extract()", function () {
        it("should return null when there isn't parameter", async function () {
            const url = new URL("plugin://plugin.video.youtube/play/");

            const label = await extract(url);
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

            const label = await extract(url);
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

            const label = await extract(url);
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

            const label = await extract(url);
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

            const label = await extract(url);
            assert.strictEqual(label, "Mix");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.youtube.com/playlist?list=foo",
            ]);

            stub.restore();
        });
    });
});
