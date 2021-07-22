import assert from "node:assert";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/vimeo.js";

describe("core/labeller/vimeo.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const videoId = "foo";

            const label = await labeller.extract(videoId);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vimeo.com/foo",
            ]);

            stub.restore();
        });
    });
});
