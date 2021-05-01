import assert from "node:assert";
import sinon from "sinon";
import { Application } from "../../../../src/core/jsonrpc/application.js";

describe("core/jsonrpc/application.js", function () {
    describe("getProperties()", function () {
        it("should return properties", async function () {
            const fake = sinon.fake.resolves({ mute: false, volume: 51 });

            const application = new Application({ send: fake });
            const properties = ["mute", "volume"];
            const result = await application.getProperties(properties);
            assert.deepStrictEqual(result, { mute: false, volume: 51 });

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.GetProperties",
                { properties },
            ]);
        });
    });

    describe("setMute()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves(false);

            const application = new Application({ send: fake });
            const result = await application.setMute();
            assert.strictEqual(result, false);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.SetMute",
                { mute: "toggle" },
            ]);
        });
    });

    describe("setVolume()", function () {
        it("should send request with number", async function () {
            const fake = sinon.fake((method) => {
                switch (method) {
                    case "Application.SetMute":
                        return Promise.resolve(false);
                    case "Application.SetVolume":
                        return Promise.resolve(42);
                    default:
                        return Promise.reject(method);
                }
            });

            const application = new Application({ send: fake });
            const volume = 42;
            const result = await application.setVolume(volume);
            assert.strictEqual(result, volume);

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);
        });

        it("should send request with string", async function () {
            const fake = sinon.fake((method) => {
                switch (method) {
                    case "Application.SetMute":
                        return Promise.resolve(false);
                    case "Application.SetVolume":
                        return Promise.resolve(43);
                    default:
                        return Promise.reject(method);
                }
            });

            const application = new Application({ send: fake });
            const volume = "increment";
            const result = await application.setVolume(volume);
            assert.strictEqual(result, 43);

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onPropertyChanged.addListener(assert.fail);
            application.handleNotification({
                method: "Other.OnVolumeChanged",
                params: { data: "foo" },
            });
            done();
        });

        it("should ignore when no listener", async function () {
            const fake = sinon.fake.rejects(new Error("bar"));

            const application = new Application({ send: fake });
            await application.handleNotification({
                method: "Application.OnVolumeChanged",
                params: { data: "foo" },
            });

            assert.strictEqual(fake.callCount, 0);
        });

        it("should handle 'OnVolumeChanged'", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { foo: "bar", volume: 98 });
                done();
            });
            application.handleNotification({
                method: "Application.OnVolumeChanged",
                params: { data: { foo: "bar", volume: 98.7 } },
            });
            assert.fail();
        });

        it("should handle 'OnVolumeChanged' without volume", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { muted: true });
                done();
            });
            application.handleNotification({
                method: "Application.OnVolumeChanged",
                params: { data: { muted: true } },
            });
            assert.fail();
        });

        it("should ignore others notifications", function (done) {
            const application = new Application({ send: Function.prototype });
            application.onPropertyChanged.addListener(assert.fail);
            application.handleNotification({
                method: "Application.Other",
                params: { data: "foo" },
            });
            done();
        });
    });
});
