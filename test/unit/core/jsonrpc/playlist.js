/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { Playlist } from "../../../../src/core/jsonrpc/playlist.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";

describe("core/jsonrpc/playlist.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("add()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const file = "foo";
            const result = await playlist.add(file);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Add",
                { playlistid: 1, item: { file } },
            ]);
        });
    });

    describe("clear()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const result = await playlist.clear();
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Clear",
                { playlistid: 1 },
            ]);
        });
    });

    describe("getItems()", function () {
        it("should return items", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({ items: [{ foo: "bar" }, { foo: "baz" }] }),
            );

            const playlist = new Playlist(kodi);
            const result = await playlist.getItems();
            assert.deepEqual(result, [
                { foo: "bar", position: 0 },
                { foo: "baz", position: 1 },
            ]);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.GetItems",
                { playlistid: 1, properties: ["file", "title"] },
            ]);
        });

        it("should return an empty array when no items", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve({}));

            const playlist = new Playlist(kodi);
            const result = await playlist.getItems();
            assert.deepEqual(result, []);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.GetItems",
                { playlistid: 1, properties: ["file", "title"] },
            ]);
        });
    });

    describe("getItem()", function () {
        it("should return item", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({ items: ["foo"] }),
            );

            const playlist = new Playlist(kodi);
            const position = 42;
            const result = await playlist.getItem(position);
            assert.equal(result, "foo");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits: { start: 42, end: 43 },
                },
            ]);
        });

        it("should return undefined when no item", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve({}));

            const playlist = new Playlist(kodi);
            const position = 42;
            const result = await playlist.getItem(position);
            assert.equal(result, undefined);

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits: { start: 42, end: 43 },
                },
            ]);
        });
    });

    describe("insert()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const file = "foo";
            const position = 42;
            const result = await playlist.insert(file, position);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Insert",
                { playlistid: 1, position, item: { file } },
            ]);
        });
    });

    describe("remove()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const position = 42;
            const result = await playlist.remove(position);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Remove",
                { playlistid: 1, position },
            ]);
        });
    });

    describe("swap()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const position1 = 42;
            const position2 = 24;
            const result = await playlist.swap(position1, position2);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Swap",
                { playlistid: 1, position1, position2 },
            ]);
        });
    });

    describe("move()", function () {
        it("should move before", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const position = 2;
            const destination = 0;
            const result = await playlist.move(position, destination);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 2);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Swap",
                { playlistid: 1, position1: 2, position2: 1 },
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, [
                "Playlist.Swap",
                { playlistid: 1, position1: 1, position2: 0 },
            ]);
        });

        it("should move after", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () => Promise.resolve("OK"));

            const playlist = new Playlist(kodi);
            const position = 1;
            const destination = 5;
            const result = await playlist.move(position, destination);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 3);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.Swap",
                { playlistid: 1, position1: 1, position2: 2 },
            ]);
            assert.deepEqual(send.mock.calls[1].arguments, [
                "Playlist.Swap",
                { playlistid: 1, position1: 2, position2: 3 },
            ]);
            assert.deepEqual(send.mock.calls[2].arguments, [
                "Playlist.Swap",
                { playlistid: 1, position1: 3, position2: 4 },
            ]);
        });

        it("should not move", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");

            const playlist = new Playlist(kodi);
            const result = await playlist.move(42, 42);
            assert.equal(result, "OK");

            assert.equal(send.mock.callCount(), 0);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const addListener = mock.fn();
            const clearListener = mock.fn();
            const removeListener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(addListener);
            playlist.onClear.addListener(clearListener);
            playlist.onRemove.addListener(removeListener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    // Utiliser un espace de 9 caractères pour avoir la même
                    // longueur que le mot "Playlist".
                    method: "123456789.OnAdd",
                    params: { data: null },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(addListener.mock.callCount(), 0);
            assert.equal(clearListener.mock.callCount(), 0);
            assert.equal(removeListener.mock.callCount(), 0);
        });

        it("should ignore when no listener on add", async function () {
            const playlist = new Playlist(new Kodi());
            const dispatch = mock.method(playlist.onAdd, "dispatch");
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnAdd",
                    params: { data: { playlistid: 1 } },
                }),
            );

            assert.equal(dispatch.mock.callCount(), 0);
        });

        it("should ignore when no listener on clear", async function () {
            const playlist = new Playlist(new Kodi());
            const dispatch = mock.method(playlist.onClear, "dispatch");
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnClear",
                    params: { data: { playlistid: 1 } },
                }),
            );

            assert.equal(dispatch.mock.callCount(), 0);
        });

        it("should ignore when no listener on remove", async function () {
            const playlist = new Playlist(new Kodi());
            const dispatch = mock.method(playlist.onRemove, "dispatch");
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnRemove",
                    params: { data: { playlistid: 1 } },
                }),
            );

            assert.equal(dispatch.mock.callCount(), 0);
        });

        it("should ignore others playlists", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const addListener = mock.fn();
            const clearListener = mock.fn();
            const removeListener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(addListener);
            playlist.onClear.addListener(clearListener);
            playlist.onRemove.addListener(removeListener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnAdd",
                    params: { data: { playlistid: 2 } },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(addListener.mock.callCount(), 0);
            assert.equal(clearListener.mock.callCount(), 0);
            assert.equal(removeListener.mock.callCount(), 0);
        });

        it("should handle 'OnAdd'", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({ items: [{ foo: "bar" }] }),
            );
            const listener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(listener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnAdd",
                    params: { data: { playlistid: 1, position: 2 } },
                }),
            );

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits: { start: 2, end: 3 },
                },
            ]);
            assert.equal(listener.mock.callCount(), 1);
            assert.deepEqual(listener.mock.calls[0].arguments, [
                {
                    foo: "bar",
                    position: 2,
                },
            ]);
        });

        it("should only handle 'OnAdd'", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send", () =>
                Promise.resolve({ items: [{ foo: "bar" }] }),
            );
            const addListener = mock.fn();
            const clearListener = mock.fn();
            const removeListener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(addListener);
            playlist.onClear.addListener(clearListener);
            playlist.onRemove.addListener(removeListener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnAdd",
                    params: { data: { playlistid: 1, position: 2 } },
                }),
            );

            assert.equal(send.mock.callCount(), 1);
            assert.deepEqual(send.mock.calls[0].arguments, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits: { start: 2, end: 3 },
                },
            ]);
            assert.equal(addListener.mock.callCount(), 1);
            assert.deepEqual(addListener.mock.calls[0].arguments, [
                { foo: "bar", position: 2 },
            ]);
            assert.equal(clearListener.mock.callCount(), 0);
            assert.equal(removeListener.mock.callCount(), 0);
        });

        it("should handle 'OnClear'", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const listener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onClear.addListener(listener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnClear",
                    params: { data: { playlistid: 1 } },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(listener.mock.callCount(), 1);
            assert.deepEqual(listener.mock.calls[0].arguments, [undefined]);
        });

        it("should only handle 'OnClear'", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const addListener = mock.fn();
            const clearListener = mock.fn();
            const removeListener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(addListener);
            playlist.onClear.addListener(clearListener);
            playlist.onRemove.addListener(removeListener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnClear",
                    params: { data: { playlistid: 1 } },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(addListener.mock.callCount(), 0);
            assert.equal(clearListener.mock.callCount(), 1);
            assert.deepEqual(clearListener.mock.calls[0].arguments, [
                undefined,
            ]);
            assert.equal(removeListener.mock.callCount(), 0);
        });

        it("should handle 'OnRemove'", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const listener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onRemove.addListener(listener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnRemove",
                    params: { data: { playlistid: 1, position: 2 } },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(listener.mock.callCount(), 1);
            assert.deepEqual(listener.mock.calls[0].arguments, [2]);
        });

        it("should only handle 'OnRemove'", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const addListener = mock.fn();
            const clearListener = mock.fn();
            const removeListener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(addListener);
            playlist.onClear.addListener(clearListener);
            playlist.onRemove.addListener(removeListener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.OnRemove",
                    params: { data: { playlistid: 1, position: 2 } },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(addListener.mock.callCount(), 0);
            assert.equal(clearListener.mock.callCount(), 0);
            assert.equal(removeListener.mock.callCount(), 1);
            assert.deepEqual(removeListener.mock.calls[0].arguments, [2]);
        });

        it("should ignore others notifications", async function () {
            const kodi = new Kodi();
            const send = mock.method(kodi, "send");
            const addListener = mock.fn();
            const clearListener = mock.fn();
            const removeListener = mock.fn();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(addListener);
            playlist.onClear.addListener(clearListener);
            playlist.onRemove.addListener(removeListener);
            await playlist.handleNotification(
                new NotificationEvent("notification", {
                    method: "Playlist.Other",
                    params: { data: { playlistid: 1 } },
                }),
            );

            assert.equal(send.mock.callCount(), 0);
            assert.equal(addListener.mock.callCount(), 0);
            assert.equal(clearListener.mock.callCount(), 0);
            assert.equal(removeListener.mock.callCount(), 0);
        });
    });
});
