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
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://blog.soundcloud.com/");

            const file = await labeller.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://soundcloud.com/bar");

            const label = await labeller.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://soundcloud.com/bar"),
            ]);
        });

        it("should return undefined when it isn't audio page", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("<html><head></head></html>"));

            const url = new URL("https://soundcloud.com/foo");

            const label = await labeller.extract(url);
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://soundcloud.com/foo"),
            ]);
        });
    });
});
