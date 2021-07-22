import assert from "node:assert";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/dailymotion.js";

describe("core/labeller/dailymotion.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar - baz - qux" />
                   </head>
                 </html>`,
            ));

            const videoId = "foo";

            const label = await labeller.extract(videoId);
            assert.strictEqual(label, "bar - baz");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://www.dailymotion.com/video/foo",
            ]);

            stub.restore();
        });
    });
});
