import assert from "node:assert/strict";
import sinon from "sinon";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { System } from "../../../../src/core/jsonrpc/system.js";

describe("core/jsonrpc/system.js", function () {
    describe("getProperties()", function () {
        it("should return properties", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                foo: true,
                bar: false,
            });

            const system = new System(kodi);
            const properties = ["foo", "bar"];
            const result = await system.getProperties(properties);
            assert.deepEqual(result, { foo: true, bar: false });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "System.GetProperties",
                { properties },
            ]);
        });
    });

    describe("hibernate()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.hibernate();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["System.Hibernate"]);
        });
    });

    describe("reboot()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.reboot();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["System.Reboot"]);
        });
    });

    describe("shutdown()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.shutdown();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["System.Shutdown"]);
        });
    });

    describe("suspend()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.suspend();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["System.Suspend"]);
        });
    });
});
