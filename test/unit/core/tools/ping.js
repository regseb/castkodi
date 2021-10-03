import assert from "node:assert";
import sinon from "sinon";
import { ping } from "../../../../src/core/tools/ping.js";

describe("tools/ping.js", function () {
    describe("ping()", function () {
        it("should return true", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves();

            const ok = await ping("http://foo.com/");
            assert.strictEqual(ok, true);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/", {
                method:  "HEAD",
                headers: { Authorization: "" },
            }]);
        });

        it("should return false", async function () {
            const stub = sinon.stub(globalThis, "fetch").rejects();

            const ok = await ping("http://foo.com/");
            assert.strictEqual(ok, false);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/", {
                method:  "HEAD",
                headers: { Authorization: "" },
            }]);
        });
    });
});
