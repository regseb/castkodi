/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { Application } from "../../../../src/core/jsonrpc/application.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";
import "../../setup.js";

describe("core/jsonrpc/application.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("getProperties()", () => {
        it("should return properties", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({
                    mute: false,
                    volume: 51,
                }),
            );

            const application = new Application(kodi);
            const properties = ["mute", "volume"];
            const result = await application.getProperties(properties);
            assert.deepEqual(result, { mute: false, volume: 51 });

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Application.GetProperties",
                { properties },
            ]);
        });
    });

    describe("setMute()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve(false),
            );

            const application = new Application(kodi);
            const result = await application.setMute();
            assert.equal(result, false);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Application.SetMute",
                { mute: "toggle" },
            ]);
        });
    });

    describe("setVolume()", () => {
        it("should send request with number", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => {
                switch (send.mock.callCount()) {
                    case 0:
                        return false;
                    case 1:
                        return 42;
                    default:
                        throw new Error("Third unexpected call");
                }
            });

            const application = new Application(kodi);
            const volume = 42;
            const result = await application.setVolume(volume);
            assert.equal(result, volume);

            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, [
                "Application.SetVolume",
                { volume },
            ]);
        });

        it("should send request with string", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => {
                switch (send.mock.callCount()) {
                    case 0:
                        return false;
                    case 1:
                        return 43;
                    default:
                        throw new Error("Third unexpected call");
                }
            });

            const application = new Application(kodi);
            const volume = "increment";
            const result = await application.setVolume(volume);
            assert.equal(result, 43);

            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Application.SetMute",
                { mute: false },
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, [
                "Application.SetVolume",
                { volume },
            ]);
        });
    });

    describe("handleNotification()", () => {
        it("should ignore others namespaces", () => {
            const listener = mock.fn();

            const application = new Application(new Kodi());
            application.onPropertyChanged.addListener(listener);
            application.handleNotification(
                new NotificationEvent("notification", {
                    // Utiliser un espace de 11 caractères pour avoir la même
                    // longueur que le mot "Application".
                    method: "12345678901.OnVolumeChanged",
                    params: { data: null },
                }),
            );

            assert.equal(listener.mock.callCount(), 0);
        });

        it("should ignore when no listener", () => {
            const application = new Application(new Kodi());
            const dispatch = mock.method(
                application.onPropertyChanged,
                "dispatch",
            );
            application.handleNotification(
                new NotificationEvent("notification", {
                    method: "Application.OnVolumeChanged",
                    params: { data: { foo: "bar" } },
                }),
            );

            assert.equal(dispatch.mock.callCount(), 0);
        });

        it("should handle 'OnVolumeChanged'", () => {
            const listener = mock.fn();

            const application = new Application(new Kodi());
            application.onPropertyChanged.addListener(listener);
            application.handleNotification(
                new NotificationEvent("notification", {
                    method: "Application.OnVolumeChanged",
                    params: { data: { foo: "bar" } },
                }),
            );

            assert.equal(listener.mock.callCount(), 1);
            assert.deepEqual(listener.mock.calls[0].arguments, [
                { foo: "bar" },
            ]);
        });

        it("should ignore others notifications", () => {
            const listener = mock.fn();

            const application = new Application(new Kodi());
            application.onPropertyChanged.addListener(listener);
            application.handleNotification(
                new NotificationEvent("notification", {
                    method: "Application.Other",
                    params: { data: "foo" },
                }),
            );

            assert.equal(listener.mock.callCount(), 0);
        });
    });
});
