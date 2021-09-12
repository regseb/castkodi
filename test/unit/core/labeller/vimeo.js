import assert from "node:assert";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/vimeo.js";

describe("core/labeller/vimeo.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="foo" />
                   </head>
                 </html>`,
            ));

            const videoId = "bar";
            const hash = undefined;

            const label = await labeller.extract(videoId, hash);
            assert.strictEqual(label, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vimeo.com/bar",
            ]);

            stub.restore();
        });

        it("should return video label from unlisted", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="foo" />
                   </head>
                 </html>`,
            ));

            const videoId = "bar";
            const hash = "baz";

            const label = await labeller.extract(videoId, hash);
            assert.strictEqual(label, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vimeo.com/bar/baz",
            ]);

            stub.restore();
        });
    });
});
