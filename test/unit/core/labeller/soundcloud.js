/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/soundcloud.js";

describe("core/labeller/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return audio label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const audioUrl = new URL("http://bar.com/");

            const label = await labeller.extract(audioUrl);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [new URL("http://bar.com/")]);
        });

        it("should return undefined when it isn't audio page", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("<html><head></head></html>"));

            const audioUrl = new URL("http://foo.com/");

            const label = await labeller.extract(audioUrl);
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [new URL("http://foo.com/")]);
        });
    });
});
