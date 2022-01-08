import assert from "node:assert";
import sinon from "sinon";
import { System } from "../../../../src/core/jsonrpc/system.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";

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
            assert.deepStrictEqual(result, { foo: true, bar: false });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
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
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["System.Hibernate"]);
        });
    });

    describe("reboot()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.reboot();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["System.Reboot"]);
        });
    });

    describe("shutdown()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.shutdown();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["System.Shutdown"]);
        });
    });

    describe("suspend()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const system = new System(kodi);
            const result = await system.suspend();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["System.Suspend"]);
        });
    });
});
