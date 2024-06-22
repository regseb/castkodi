/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { ping } from "../../../../src/core/tools/ping.js";

describe("core/tools/ping.js", function () {
    describe("ping()", function () {
        it("should return true", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves();

            const ok = await ping("https://foo.com/");
            assert.equal(ok, true);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://foo.com/",
                {
                    method: "HEAD",
                    headers: { Authorization: "" },
                },
            ]);
        });

        it("should return false", async function () {
            const stub = sinon.stub(globalThis, "fetch").rejects();

            const ok = await ping("https://foo.com/");
            assert.equal(ok, false);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://foo.com/",
                {
                    method: "HEAD",
                    headers: { Authorization: "" },
                },
            ]);
        });
    });
});
