/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { Input } from "../../../../src/core/jsonrpc/input.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";
import "../../setup.js";

describe("core/jsonrpc/input.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("back()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.back();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Back"]);
        });
    });

    describe("contextMenu()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.contextMenu();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Input.ContextMenu",
            ]);
        });
    });

    describe("down()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.down();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Down"]);
        });
    });

    describe("home()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.home();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Home"]);
        });
    });

    describe("info()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.info();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Info"]);
        });
    });

    describe("left()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.left();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Left"]);
        });
    });

    describe("right()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.right();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Right"]);
        });
    });

    describe("select()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.select();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Select"]);
        });
    });

    describe("sendText()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.sendText("foo", false);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Input.SendText",
                { text: "foo", done: false },
            ]);
        });

        it("should send request and finish", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.sendText("foo", true);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Input.SendText",
                { text: "foo", done: true },
            ]);
        });
    });

    describe("showOSD()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.showOSD();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.ShowOSD"]);
        });
    });

    describe("showPlayerProcessInfo()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.showPlayerProcessInfo();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Input.ShowPlayerProcessInfo",
            ]);
        });
    });

    describe("up()", () => {
        it("should send request", async () => {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const input = new Input(kodi);
            const result = await input.up();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Input.Up"]);
        });
    });

    describe("handleNotification()", () => {
        it("should ignore others namespaces", () => {
            const listener = mock.fn();

            const input = new Input(new Kodi());
            input.onInputRequested.addListener(listener);
            input.handleNotification(
                new NotificationEvent("notification", {
                    // Utiliser un espace de cinq caractères pour avoir la même
                    // longueur que le mot "Input".
                    method: "12345.OnInputRequested",
                    params: { data: null },
                }),
            );

            assert.equal(listener.mock.callCount(), 0);
        });

        it("should ignore when no listener", () => {
            const input = new Input(new Kodi());
            const dispatch = mock.method(input.onInputRequested, "dispatch");
            input.handleNotification(
                new NotificationEvent("notification", {
                    method: "Input.OnInputRequested",
                    params: { data: "foo" },
                }),
            );

            assert.equal(dispatch.mock.callCount(), 0);
        });

        it("should handle 'OnInputRequested'", () => {
            const listener = mock.fn();

            const input = new Input(new Kodi());
            input.onInputRequested.addListener(listener);
            input.handleNotification(
                new NotificationEvent("notification", {
                    method: "Input.OnInputRequested",
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

            const input = new Input(new Kodi());
            input.onInputRequested.addListener(listener);
            input.handleNotification(
                new NotificationEvent("notification", {
                    method: "Input.Other",
                    params: { data: "foo" },
                }),
            );

            assert.equal(listener.mock.callCount(), 0);
        });
    });
});
