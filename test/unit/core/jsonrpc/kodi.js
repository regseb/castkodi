/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { Application } from "../../../../src/core/jsonrpc/application.js";
import { GUI } from "../../../../src/core/jsonrpc/gui.js";
import { Input } from "../../../../src/core/jsonrpc/input.js";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { Player } from "../../../../src/core/jsonrpc/player.js";
import { Playlist } from "../../../../src/core/jsonrpc/playlist.js";
import { System } from "../../../../src/core/jsonrpc/system.js";
import { JSONRPC } from "../../../../src/core/tools/jsonrpc.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";

describe("core/jsonrpc/kodi.js", function () {
    describe("check()", function () {
        it("should return promise rejected", async function () {
            await assert.rejects(() => Kodi.check(""), {
                name: "PebkacError",
                type: "unconfigured",
            });
        });

        it("should return promise rejected with old version", async function () {
            const fake = sinon.fake.resolves({ version: { major: 11 } });
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send: fake,
                close: () => {},
            });

            await assert.rejects(() => Kodi.check("foo.com"), {
                name: "PebkacError",
                message: "Kodi version 19 (Matrix) is required.",
                type: "notSupported",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://foo.com:9090/jsonrpc"),
            ]);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                "JSONRPC.Version",
                undefined,
            ]);
        });

        it("should return promise fulfilled", async function () {
            const fake = sinon.fake.resolves({ version: { major: 12 } });
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send: fake,
                close: () => {},
            });

            const result = await Kodi.check("foo.com");
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://foo.com:9090/jsonrpc"),
            ]);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                "JSONRPC.Version",
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
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send: () => Promise.resolve({}),
            });

            const kodi = new Kodi("localhost");
            await kodi.send("foo");
            assert.deepEqual(kodi.url, new URL("ws://localhost:9090/jsonrpc"));

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
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
            const fake = sinon.fake();
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send: () => Promise.resolve({}),
                close: fake,
            });

            const kodi = new Kodi("localhost");
            await kodi.send("foo");
            kodi.close();
            // Fermer la connexion une deuxième fois (qui a aucun effet).
            kodi.close();

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, []);
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
            const stub = sinon.stub(JSONRPC, "open").rejects(new Error("foo"));

            const kodi = new Kodi("bar");
            await assert.rejects(() => kodi.send("Baz"), {
                name: "PebkacError",
                message:
                    "Address of Kodi Web server bar is invalid or Kodi's" +
                    " remote control isn't enabled.",
                type: "notFound",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://bar:9090/jsonrpc"),
            ]);
        });

        it("should return error when receive Kodi's error", async function () {
            const fake = sinon.fake.rejects(new Error("FooError"));
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send: fake,
            });

            const kodi = new Kodi("localhost");
            await assert.rejects(() => kodi.send("Foo"), {
                name: "Error",
                message: "FooError",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, ["Foo", undefined]);
        });

        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                send: fake,
            });

            const kodi = new Kodi("foo");
            let result = await kodi.send("Bar.Baz");
            assert.equal(result, "OK");
            result = await kodi.send("Qux.Quux", 42);
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.equal(fake.callCount, 2);
            assert.deepEqual(fake.firstCall.args, ["Bar.Baz", undefined]);
            assert.deepEqual(fake.secondCall.args, ["Qux.Quux", 42]);
        });

        it("should send request from configuration", async function () {
            await browser.storage.local.set({
                "server-list": [
                    { address: "localhost" },
                    { address: "127.0.0.1" },
                ],
                "server-active": 0,
            });
            const fake = sinon.fake.resolves("OK");
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: () => {},
                close: () => {},
                send: fake,
            });

            const kodi = new Kodi();
            let result = await kodi.send("Foo.Bar");
            assert.equal(result, "OK");
            kodi.close();
            await browser.storage.local.set({ "server-active": 1 });
            result = await kodi.send("Baz.Qux", true);
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://localhost:9090/jsonrpc"),
            ]);
            assert.deepEqual(stub.secondCall.args, [
                new URL("ws://127.0.0.1:9090/jsonrpc"),
            ]);
            assert.equal(fake.callCount, 2);
            assert.deepEqual(fake.firstCall.args, ["Foo.Bar", undefined]);
            assert.deepEqual(fake.secondCall.args, ["Baz.Qux", true]);
        });

        it("should listen close event", async function () {
            const listeners = {};
            const stub = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: (type, listener) => {
                    listeners[type] = listener;
                },
                close: () => {},
                send: () => Promise.resolve({ corge: true }),
            });

            const kodi = new Kodi("foo");
            let result = await kodi.send("Bar.Baz");
            assert.deepEqual(result, { corge: true });
            listeners.close();
            result = await kodi.send("Qux.Quux");
            assert.deepEqual(result, { corge: true });

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.deepEqual(stub.secondCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
        });

        it("should listen notification event", async function () {
            const listeners = {};
            const stubJSONRPC = sinon.stub(JSONRPC, "open").resolves({
                addEventListener: (type, listener) => {
                    listeners[type] = listener;
                },
                close: () => {},
                send: () => Promise.resolve({}),
            });

            const kodi = new Kodi("foo");
            const stubApplication = sinon.stub(
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

            assert.equal(stubJSONRPC.callCount, 1);
            assert.deepEqual(stubJSONRPC.firstCall.args, [
                new URL("ws://foo:9090/jsonrpc"),
            ]);
            assert.equal(stubApplication.callCount, 1);
            assert.equal(stubApplication.firstCall.args.length, 1);
            assert.equal(
                stubApplication.firstCall.args[0].type,
                "notification",
            );
            assert.equal(stubApplication.firstCall.args[0].method, "Qux");
            assert.deepEqual(stubApplication.firstCall.args[0].params, {
                data: "Quux",
            });
        });
    });
});
