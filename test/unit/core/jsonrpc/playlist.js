import assert from "node:assert";
import sinon from "sinon";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { Playlist } from "../../../../src/core/jsonrpc/playlist.js";
import { NotificationEvent }
                         from "../../../../src/core/tools/notificationevent.js";

describe("core/jsonrpc/playlist.js", function () {
    describe("add()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const file = "foo";
            const result = await playlist.add(file);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Add",
                { playlistid: 1, item: { file } },
            ]);

            stub.restore();
        });
    });

    describe("clear()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const result = await playlist.clear();
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Clear",
                { playlistid: 1 },
            ]);

            stub.restore();
        });
    });

    describe("getItems()", function () {
        it("should return items", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                items: [{ foo: "bar" }, { foo: "baz" }],
            });

            const playlist = new Playlist(kodi);
            const result = await playlist.getItems();
            assert.deepStrictEqual(result, [
                { foo: "bar", position: 0 },
                { foo: "baz", position: 1 },
            ]);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.GetItems",
                { playlistid: 1, properties: ["file", "title"] },
            ]);

            stub.restore();
        });

        it("should return an empty array when no items", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({});

            const playlist = new Playlist(kodi);
            const result = await playlist.getItems();
            assert.deepStrictEqual(result, []);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.GetItems",
                { playlistid: 1, properties: ["file", "title"] },
            ]);

            stub.restore();
        });
    });

    describe("getItem()", function () {
        it("should return item", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({ items: ["foo"] });

            const playlist = new Playlist(kodi);
            const position = 42;
            const result = await playlist.getItem(position);
            assert.strictEqual(result, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits:     { start: 42, end: 43 },
                },
            ]);

            stub.restore();
        });

        it("should return null when no item", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({});

            const playlist = new Playlist(kodi);
            const position = 42;
            const result = await playlist.getItem(position);
            assert.strictEqual(result, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits:     { start: 42, end: 43 },
                },
            ]);

            stub.restore();
        });
    });

    describe("insert()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const file = "foo";
            const position = 42;
            const result = await playlist.insert(file, position);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Insert",
                { playlistid: 1, position, item: { file } },
            ]);

            stub.restore();
        });
    });

    describe("remove()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const position = 42;
            const result = await playlist.remove(position);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Remove",
                { playlistid: 1, position },
            ]);

            stub.restore();
        });
    });

    describe("swap()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const position1 = 42;
            const position2 = 24;
            const result = await playlist.swap(position1, position2);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Swap",
                { playlistid: 1, position1, position2 },
            ]);

            stub.restore();
        });
    });

    describe("move()", function () {
        it("should move before", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const position = 2;
            const destination = 0;
            const result = await playlist.move(position, destination);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 2);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Swap",
                { playlistid: 1, position1: 2, position2: 1 },
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                "Playlist.Swap",
                { playlistid: 1, position1: 1, position2: 0 },
            ]);

            stub.restore();
        });

        it("should move after", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const position = 1;
            const destination = 5;
            const result = await playlist.move(position, destination);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 3);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.Swap",
                { playlistid: 1, position1: 1, position2: 2 },
            ]);
            assert.deepStrictEqual(stub.secondCall.args, [
                "Playlist.Swap",
                { playlistid: 1, position1: 2, position2: 3 },
            ]);
            assert.deepStrictEqual(stub.thirdCall.args, [
                "Playlist.Swap",
                { playlistid: 1, position1: 3, position2: 4 },
            ]);

            stub.restore();
        });

        it("should not move", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const playlist = new Playlist(kodi);
            const result = await playlist.move(42, 42);
            assert.strictEqual(result, "OK");

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fakeAdd = sinon.fake();
            const fakeClear = sinon.fake();
            const fakeRemove = sinon.fake();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(fakeAdd);
            playlist.onClear.addListener(fakeClear);
            playlist.onRemove.addListener(fakeRemove);
            await playlist.handleNotification(new NotificationEvent(
                "notification",
                {
                    method: "Other.OnAdd",
                    params: { data: { playlistid: 1 } },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fakeAdd.callCount, 0);
            assert.strictEqual(fakeClear.callCount, 0);
            assert.strictEqual(fakeRemove.callCount, 0);

            stub.restore();
        });

        it("should ignore others playlists", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fakeAdd = sinon.fake();
            const fakeClear = sinon.fake();
            const fakeRemove = sinon.fake();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(fakeAdd);
            playlist.onClear.addListener(fakeClear);
            playlist.onRemove.addListener(fakeRemove);
            await playlist.handleNotification(new NotificationEvent(
                "notification", {
                    method: "Playlist.OnAdd",
                    params: { data: { playlistid: 2 } },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fakeAdd.callCount, 0);
            assert.strictEqual(fakeClear.callCount, 0);
            assert.strictEqual(fakeRemove.callCount, 0);

            stub.restore();
        });

        it("should ignore when no listener", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");

            const playlist = new Playlist(kodi);
            await playlist.handleNotification(new NotificationEvent(
                "notification", {
                    method: "Playlist.OnAdd",
                    params: { data: "foo" },
                },
            ));

            assert.strictEqual(stub.callCount, 0);

            stub.restore();
        });

        it("should handle 'OnAdd'", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                items: [{ foo: "bar" }],
            });
            const fakeAdd = sinon.fake();
            const fakeClear = sinon.fake();
            const fakeRemove = sinon.fake();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(fakeAdd);
            playlist.onClear.addListener(fakeClear);
            playlist.onRemove.addListener(fakeRemove);
            await playlist.handleNotification(new NotificationEvent(
                "notification",
                {
                    method: "Playlist.OnAdd",
                    params: { data: { playlistid: 1, position: 2 } },
                },
            ));

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file", "title"],
                    limits:     { start: 2, end: 3 },
                },
            ]);
            assert.strictEqual(fakeAdd.callCount, 1);
            assert.deepStrictEqual(fakeAdd.firstCall.args, [{
                foo:      "bar",
                position: 2,
            }]);
            assert.strictEqual(fakeClear.callCount, 0);
            assert.strictEqual(fakeRemove.callCount, 0);

            stub.restore();
        });

        it("should handle 'OnClear'", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fakeAdd = sinon.fake();
            const fakeClear = sinon.fake();
            const fakeRemove = sinon.fake();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(fakeAdd);
            playlist.onClear.addListener(fakeClear);
            playlist.onRemove.addListener(fakeRemove);
            await playlist.handleNotification(new NotificationEvent(
                "notification", {
                    method: "Playlist.OnClear",
                    params: { data: { playlistid: 1 } },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fakeAdd.callCount, 0);
            assert.strictEqual(fakeClear.callCount, 1);
            assert.deepStrictEqual(fakeClear.firstCall.args, [undefined]);
            assert.strictEqual(fakeRemove.callCount, 0);

            stub.restore();
        });

        it("should handle 'OnRemove'", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fakeAdd = sinon.fake();
            const fakeClear = sinon.fake();
            const fakeRemove = sinon.fake();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(fakeAdd);
            playlist.onClear.addListener(fakeClear);
            playlist.onRemove.addListener(fakeRemove);
            await playlist.handleNotification(new NotificationEvent(
                "notification", {
                    method: "Playlist.OnRemove",
                    params: { data: { playlistid: 1, position: 2 } },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fakeAdd.callCount, 0);
            assert.strictEqual(fakeClear.callCount, 0);
            assert.strictEqual(fakeRemove.callCount, 1);
            assert.deepStrictEqual(fakeRemove.firstCall.args, [2]);

            stub.restore();
        });

        it("should ignore others notifications", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send");
            const fakeAdd = sinon.fake();
            const fakeClear = sinon.fake();
            const fakeRemove = sinon.fake();

            const playlist = new Playlist(kodi);
            playlist.onAdd.addListener(fakeAdd);
            playlist.onClear.addListener(fakeClear);
            playlist.onRemove.addListener(fakeRemove);
            await playlist.handleNotification(new NotificationEvent(
                "notification",
                {
                    method: "Playlist.Other",
                    params: { data: { playlistid: 1 } },
                },
            ));

            assert.strictEqual(stub.callCount, 0);
            assert.strictEqual(fakeAdd.callCount, 0);
            assert.strictEqual(fakeClear.callCount, 0);
            assert.strictEqual(fakeRemove.callCount, 0);

            stub.restore();
        });
    });
});
