import assert from "node:assert";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/dumpert.js";

describe("core/labeller/dumpert.js", function () {
    describe("extract()", function () {
        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <head>
                     <meta property="og:title" content="bar" />
                   </head>
                 </html>`,
            ));

            const videoUrl = new URL("http://foo.com/");

            const label = await labeller.extract(videoUrl);
            assert.strictEqual(label, "bar");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/"]);

            stub.restore();
        });
    });
});
