import assert from "node:assert";
import sinon from "sinon";
import { NotificationEvent } from "../../../../src/tools/notificationevent.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { Application } from "../../../../src/core/jsonrpc/application.js";

describe("core/jsonrpc/application.js", function () {
    describe("getProperties()", function () {
        it("should return properties", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                mute:   false,
                volume: 51,
            });

            const application = new Application(kodi);
            const properties = ["mute", "volume"];
            const result = await application.getProperties(properties);
            assert.deepStrictEqual(result, { mute: false, volume: 51 });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Application.GetProperties",
                { properties },
            ]);

            stub.restore();
        });
    });

    describe("setMute()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves(false);

            const application = new Application(kodi);
            const result = await application.setMute();
            assert.strictEqual(result, false);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Application.SetMute",
                { mute: "toggle" },
            ]);

            stub.restore();
        });
    });

    describe("setVolume()", function () {
        it("should send request with number", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").callsFake((method) => {
                switch (method) {
                    case "Application.SetMute":
                        return Promise.resolve(false);
                    case "Application.SetVolume":
                        return Promise.resolve(42);
                    default:
                        return Promise.reject(method);
                }
            });

            const application = new Application(kodi);
            const volume = 42;
            const result = await application.setVolume(volume);
            assert.strictEqual(result, volume);

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);

            stub.restore();
        });

        it("should send request with string", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").callsFake((method) => {
                switch (method) {
                    case "Application.SetMute":
                        return Promise.resolve(false);
                    case "Application.SetVolume":
                        return Promise.resolve(43);
                    default:
                        return Promise.reject(method);
                }
            });

            const application = new Application(kodi);
            const volume = "increment";
            const result = await application.setVolume(volume);
            assert.strictEqual(result, 43);

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);

            stub.restore();
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fake = sinon.fake();

            const application = new Application(kodi);
            application.onPropertyChanged.addListener(fake);
            application.handleNotification(new NotificationEvent(
                "notification",
                { method: "Other.OnVolumeChanged",  params: { data: "foo" } },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fake.callCount, 0);

            stub.restore();
        });

        it("should ignore when no listener", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");

            const application = new Application(kodi);
            application.handleNotification(new NotificationEvent(
                "notification",
                {
                    method: "Application.OnVolumeChanged",
                    params: { data: "foo" },
                },
            ));

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });

        it("should handle 'OnVolumeChanged'", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fake = sinon.fake();

            const application = new Application(kodi);
            application.onPropertyChanged.addListener(fake);
            application.handleNotification(new NotificationEvent(
                "notification",
                {
                    method: "Application.OnVolumeChanged",
                    params: { data: { foo: "bar" } },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [{ foo: "bar" }]);

            stub.restore();
        });

        it("should ignore others notifications", function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fake = sinon.fake();

            const application = new Application(kodi);
            application.onPropertyChanged.addListener(fake);
            application.handleNotification(new NotificationEvent(
                "notification",
                {
                    method: "Application.Other",
                    params: { data: "foo" },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fake.callCount, 0);

            stub.restore();
        });
    });
});
