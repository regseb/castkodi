/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { System } from "../../../../src/core/jsonrpc/system.js";
import "../../setup.js";

describe("core/jsonrpc/system.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("getProperties()", () => {
        it("should return properties", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({
                    foo: true,
                    bar: false,
                }),
            );

            const system = new System(kodi);
            const properties = ["foo", "bar"];
            const result = await system.getProperties(properties);
            assert.deepEqual(result, { foo: true, bar: false });

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "System.GetProperties",
                { properties },
            ]);
        });
    });

    describe("hibernate()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const system = new System(kodi);
            const result = await system.hibernate();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "System.Hibernate",
            ]);
        });
    });

    describe("reboot()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const system = new System(kodi);
            const result = await system.reboot();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["System.Reboot"]);
        });
    });

    describe("shutdown()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const system = new System(kodi);
            const result = await system.shutdown();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["System.Shutdown"]);
        });
    });

    describe("suspend()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const system = new System(kodi);
            const result = await system.suspend();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["System.Suspend"]);
        });
    });
});
