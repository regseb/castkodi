/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { Application } from "../../../../src/core/jsonrpc/application.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";

describe("core/jsonrpc/application.js", function () {
    describe("getProperties()", function () {
        it("should return properties", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                mute: false,
                volume: 51,
            });

            const application = new Application(kodi);
            const properties = ["mute", "volume"];
            const result = await application.getProperties(properties);
            assert.deepEqual(result, { mute: false, volume: 51 });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Application.GetProperties",
                { properties },
            ]);
        });
    });

    describe("setMute()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves(false);

            const application = new Application(kodi);
            const result = await application.setMute();
            assert.equal(result, false);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Application.SetMute",
                { mute: "toggle" },
            ]);
        });
    });

    describe("setVolume()", function () {
        it("should send request with number", async function () {
            const kodi = new Kodi();
            const stub = sinon
                .stub(kodi, "send")
                .onFirstCall()
                .resolves(false)
                .onSecondCall()
                .resolves(42);

            const application = new Application(kodi);
            const volume = 42;
            const result = await application.setVolume(volume);
            assert.equal(result, volume);

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepEqual(stub.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);
        });

        it("should send request with string", async function () {
            const kodi = new Kodi();
            const stub = sinon
                .stub(kodi, "send")
                .onFirstCall()
                .resolves(false)
                .onSecondCall()
                .resolves(43);

            const application = new Application(kodi);
            const volume = "increment";
            const result = await application.setVolume(volume);
            assert.equal(result, 43);

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepEqual(stub.secondCall.args, [
                "Application.SetVolume",
                { volume },
            ]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function () {
            const fake = sinon.fake();

            const application = new Application(new Kodi());
            application.onPropertyChanged.addListener(fake);
            application.handleNotification(
                new NotificationEvent("notification", {
                    // Utiliser un espace de 11 caractères pour avoir la même
                    // longueur que le mot "Application".
                    method: "12345678901.OnVolumeChanged",
                    // eslint-disable-next-line unicorn/no-null
                    params: { data: null },
                }),
            );

            assert.equal(fake.callCount, 0);
        });

        it("should ignore when no listener", function () {
            const application = new Application(new Kodi());
            const spy = sinon.spy(application.onPropertyChanged, "dispatch");
            application.handleNotification(
                new NotificationEvent("notification", {
                    method: "Application.OnVolumeChanged",
                    params: { data: { foo: "bar" } },
                }),
            );

            assert.equal(spy.callCount, 0);
        });

        it("should handle 'OnVolumeChanged'", function () {
            const fake = sinon.fake();

            const application = new Application(new Kodi());
            application.onPropertyChanged.addListener(fake);
            application.handleNotification(
                new NotificationEvent("notification", {
                    method: "Application.OnVolumeChanged",
                    params: { data: { foo: "bar" } },
                }),
            );

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [{ foo: "bar" }]);
        });

        it("should ignore others notifications", function () {
            const fake = sinon.fake();

            const application = new Application(new Kodi());
            application.onPropertyChanged.addListener(fake);
            application.handleNotification(
                new NotificationEvent("notification", {
                    method: "Application.Other",
                    params: { data: "foo" },
                }),
            );

            assert.equal(fake.callCount, 0);
        });
    });
});
