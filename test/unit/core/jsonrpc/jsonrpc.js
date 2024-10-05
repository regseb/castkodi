/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { JSONRPC } from "../../../../src/core/jsonrpc/jsonrpc.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";

describe("core/jsonrpc/jsonrpc.js", function () {
    describe("ping()", function () {
        it("should ping", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("pong");

            const jsonrpc = new JSONRPC(kodi);
            const result = await jsonrpc.ping();
            assert.equal(result, "pong");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["JSONRPC.Ping"]);
        });
    });

    describe("version()", function () {
        it("should return version", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                version: { major: 1, minor: 2, patch: 3 },
            });

            const jsonrpc = new JSONRPC(kodi);
            const version = await jsonrpc.version();
            assert.deepEqual(version, { major: 1, minor: 2, patch: 3 });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["JSONRPC.Version"]);
        });
    });
});
