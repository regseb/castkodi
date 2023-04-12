/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/dumpert.js";

describe("core/labeller/dumpert.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.dumpert.nl/huisregels");

            const file = await labeller.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.dumpert.nl/item/bar");

            const label = await labeller.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.dumpert.nl/item/bar"),
            ]);
        });
    });
});
