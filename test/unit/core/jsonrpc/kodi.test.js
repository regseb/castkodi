/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { Application } from "../../../../src/core/jsonrpc/application.js";
import { GUI } from "../../../../src/core/jsonrpc/gui.js";
import { Input } from "../../../../src/core/jsonrpc/input.js";
import { JSONRPC } from "../../../../src/core/jsonrpc/jsonrpc.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { Player } from "../../../../src/core/jsonrpc/player.js";
import { Playlist } from "../../../../src/core/jsonrpc/playlist.js";
import { System } from "../../../../src/core/jsonrpc/system.js";
import { JSONRPC as JSONRPCClient } from "../../../../src/core/tools/jsonrpc.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/jsonrpc/kodi.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("check()", function () {
        it("should return promise rejected", async function () {
            await assert.rejects(() => Kodi.check(""), {
                name: "PebkacError",
                type: "unconfigured",
            });
        });

        it("should return promise rejected with old version", async function () {
            const send = mock.fn(() =>
                Promise.resolve({ version: { major: 12 } }),
            );
            const fix = mock.method(Kodi, "fix");
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                    close: () => undefined,
                }),
            );

            await assert.rejects(() => Kodi.check("foo.com"), {
                name: "PebkacError",
                message: "Kodi version 20 (Nexus) is required.",
                type: "notSupported",
            });

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo.com:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "JSONRPC.Version",
                undefined,
            ]);
            // Vérifier que la recherche d'une adresse alternative ne se fait
            // pas.
            assert.equal(fix.mock.callCount(), 0);
        });

        it("should return promise rejected with fix", async function () {
            const send = mock.fn(() =>
                Promise.reject(new PebkacError("notFound", "foo")),
            );
            const fix = mock.method(Kodi, "fix", () => Promise.resolve("bar"));
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                    close: () => undefined,
                }),
            );

            await assert.rejects(() => Kodi.check("foo"), {
                name: "PebkacError",
                message:
                    "Address of Kodi Web server foo is invalid or Kodi's" +
                    " remote control isn't enabled.",
                type: "notFound",
                details: { fix: "bar" },
            });

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "JSONRPC.Version",
                undefined,
            ]);
            assert.equal(fix.mock.callCount(), 1);
            assert.deepEqual(fix.mock.calls[0].arguments, ["foo"]);
        });

        it("should return promise rejected without fix", async function () {
            const send = mock.fn(() =>
                Promise.reject(new PebkacError("notFound", "foo")),
            );
            const fix = mock.method(Kodi, "fix", () =>
                Promise.resolve(undefined),
            );
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                    close: () => undefined,
                }),
            );

            await assert.rejects(() => Kodi.check("foo"), {
                name: "PebkacError",
                message:
                    "Address of Kodi Web server foo is invalid or Kodi's" +
                    " remote control isn't enabled.",
                type: "notFound",
                details: {},
            });

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "JSONRPC.Version",
                undefined,
            ]);
            assert.equal(fix.mock.callCount(), 1);
            assert.deepEqual(fix.mock.calls[0].arguments, ["foo"]);
        });

        it("should return promise fulfilled", async function () {
            const send = mock.fn(() =>
                Promise.resolve({ version: { major: 13 } }),
            );
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                    close: () => undefined,
                }),
            );

            const result = await Kodi.check("foo.com");
            assert.equal(result, "OK");

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo.com:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "JSONRPC.Version",
                undefined,
            ]);
        });
    });

    describe("fix()", function () {
        it("should return alternative address", async function () {
            const send = mock.fn(() => Promise.resolve("pong"));
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                    close: () => undefined,
                }),
            );

            const fix = await Kodi.fix("http://192.168.0.1:8080/foo");
            assert.equal(fix, "192.168.0.1");

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://192.168.0.1:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "JSONRPC.Ping",
                undefined,
            ]);
        });

        it("shouldn't return alternative address", async function () {
            const send = mock.fn(() =>
                Promise.reject(new PebkacError("notFound", "192.168.0.1")),
            );
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                    close: () => undefined,
                }),
            );

            const fix = await Kodi.fix("http://192.168.0.1:8080/foo");
            assert.equal(fix, undefined);

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://192.168.0.1:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "JSONRPC.Ping",
                undefined,
            ]);
        });
    });

    describe("get url()", function () {
        it("should return undefined when url isn't built", function () {
            const kodi = new Kodi("localhost");
            assert.equal(kodi.url, undefined);
        });

        it("should return URL when url is built", async function () {
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send: () => Promise.resolve({}),
                }),
            );

            const kodi = new Kodi("localhost");
            await kodi.send("foo");
            assert.deepEqual(kodi.url, new URL("ws://localhost:9090/jsonrpc"));

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
        });
    });

    describe("get application()", function () {
        it("should return Application object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.application instanceof Application);
        });
    });

    describe("get gui()", function () {
        it("should return GUI object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.gui instanceof GUI);
        });
    });

    describe("get input()", function () {
        it("should return Input object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.input instanceof Input);
        });
    });

    describe("get jsonrpc()", function () {
        it("should return JSONRPC object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.jsonrpc instanceof JSONRPC);
        });
    });

    describe("get player()", function () {
        it("should return Player object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.player instanceof Player);
        });
    });

    describe("get playlist()", function () {
        it("should return Playlist object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.playlist instanceof Playlist);
        });
    });

    describe("get system()", function () {
        it("should return System object", function () {
            const kodi = new Kodi("localhost");
            assert.ok(kodi.system instanceof System);
        });
    });

    describe("close()", function () {
        it("should close WebSocket", async function () {
            const close = mock.fn();
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send: () => Promise.resolve({}),
                    close,
                }),
            );

            const kodi = new Kodi("localhost");
            await kodi.send("foo");
            kodi.close();
            // Fermer la connexion une deuxième fois (qui a aucun effet).
            kodi.close();

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.equal(close.mock.callCount(), 1);
            assert.deepEqual(close.mock.calls[0].arguments, []);
        });
    });

    describe("send()", function () {
        it("should return error when no address", async function () {
            const kodi = new Kodi("");
            await assert.rejects(() => kodi.send("Foo"), {
                name: "PebkacError",
                type: "unconfigured",
            });
        });

        it("should return error when address is invalid", async function () {
            const kodi = new Kodi("foo bar");
            await assert.rejects(() => kodi.send("Baz"), {
                name: "PebkacError",
                message: "Address of Kodi Web server foo bar is invalid.",
                type: "badAddress",
            });
        });

        it("should return error when IP is invalid", async function () {
            const kodi = new Kodi("192.168");
            await assert.rejects(() => kodi.send("Foo"), {
                name: "PebkacError",
                message: "Address of Kodi Web server 192.168 is invalid.",
                type: "badAddress",
            });
        });

        it("should return error when receive 400", async function () {
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.reject(new Error("foo")),
            );

            const kodi = new Kodi("bar");
            await assert.rejects(() => kodi.send("Baz"), {
                name: "PebkacError",
                message:
                    "Address of Kodi Web server bar is invalid or Kodi's" +
                    " remote control isn't enabled.",
                type: "notFound",
            });

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://bar:9090/jsonrpc"),
            ]);
        });

        it("should return error when receive Kodi's error", async function () {
            const send = mock.fn(() => Promise.reject(new Error("FooError")));
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                }),
            );

            const kodi = new Kodi("localhost");
            await assert.rejects(() => kodi.send("Foo"), {
                name: "Error",
                message: "FooError",
            });

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, ["Foo", undefined]);
        });

        it("should send request", async function () {
            const send = mock.fn(() => Promise.resolve("OK"));
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    send,
                }),
            );

            const kodi = new Kodi("foo");
            let result = await kodi.send("Bar.Baz");
            assert.equal(result, "OK");
            result = await kodi.send("Qux.Quux", 42);
            assert.equal(result, "OK");

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Bar.Baz",
                undefined,
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, ["Qux.Quux", 42]);
        });

        it("should send request from configuration", async function () {
            await browser.storage.local.set({
                "server-list": [
                    { address: "localhost" },
                    { address: "127.0.0.1" },
                ],
                "server-active": 0,
            });
            const send = mock.fn(() => Promise.resolve("OK"));
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: () => undefined,
                    close: () => undefined,
                    send,
                }),
            );

            const kodi = new Kodi();
            let result = await kodi.send("Foo.Bar");
            assert.equal(result, "OK");
            kodi.close();
            await browser.storage.local.set({ "server-active": 1 });
            result = await kodi.send("Baz.Qux", true);
            assert.equal(result, "OK");

            assert.equal(open.mock.callCount(), 2);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.deepEqual(open.mock.calls[1].arguments, [
                new URL("ws://127.0.0.1:9090/jsonrpc"),
            ]);
            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Foo.Bar",
                undefined,
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, ["Baz.Qux", true]);
        });

        it("should listen close event", async function () {
            const listeners = {};
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: (type, listener) => {
                        listeners[type] = listener;
                    },
                    close: () => undefined,
                    send: () => Promise.resolve({ corge: true }),
                }),
            );

            const kodi = new Kodi("foo");
            let result = await kodi.send("Bar.Baz");
            assert.deepEqual(result, { corge: true });
            listeners.close();
            result = await kodi.send("Qux.Quux");
            assert.deepEqual(result, { corge: true });

            assert.equal(open.mock.callCount(), 2);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.deepEqual(open.mock.calls[1].arguments, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
        });

        it("should listen notification event", async function () {
            const listeners = {};
            const open = mock.method(JSONRPCClient, "open", () =>
                Promise.resolve({
                    addEventListener: (type, listener) => {
                        listeners[type] = listener;
                    },
                    close: () => undefined,
                    send: () => Promise.resolve({}),
                }),
            );

            const kodi = new Kodi("foo");
            const handleNotification = mock.method(
                kodi.application,
                "handleNotification",
            );
            await kodi.send("Bar.Baz");
            listeners.notification(
                new NotificationEvent("notification", {
                    method: "Qux",
                    params: { data: "Quux" },
                }),
            );

            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.equal(handleNotification.mock.callCount(), 1);
            assert.equal(handleNotification.mock.calls[0].arguments.length, 1);
            assert.equal(
                handleNotification.mock.calls[0].arguments[0].type,
                "notification",
            );
            assert.equal(
                handleNotification.mock.calls[0].arguments[0].method,
                "Qux",
            );
            assert.deepEqual(
                handleNotification.mock.calls[0].arguments[0].params,
                {
                    data: "Quux",
                },
            );
        });
    });
});
