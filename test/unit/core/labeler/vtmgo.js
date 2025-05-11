/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../src/core/labeler/vtmgo.js";

describe("core/labeler/vtmgo.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.vtmgo.be/vtmgo/regarder/foo");

            const label = await labeler.extract(url);
            assert.equal(label, undefined);
        });

        it("should return label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <title>foo</title>
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/bar");

            const label = await labeler.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });

        it("should return undefined when there isn't title", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <h1>foo</h1>
                     </body></html>`,
                ),
            );

            const url = new URL("https://www.vtmgo.be/vtmgo/afspelen/bar");

            const label = await labeler.extract(url);
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });
    });
});
