import assert       from "assert";
import sinon        from "sinon";
import { Playlist } from "../../../../src/core/jsonrpc/playlist.js";

describe("core/jsonrpc/playlist.js", function () {
    describe("add()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const playlist = new Playlist({ send: fake });
            const file = "foo";
            const result = await playlist.add(file);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.Add",
                { playlistid: 1, item: { file } },
            ]);
        });
    });

    describe("clear()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const playlist = new Playlist({ send: fake });
            const result = await playlist.clear();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.Clear",
                { playlistid: 1 },
            ]);
        });
    });

    describe("getItems()", function () {
        it("should return items", async function () {
            const fake = sinon.fake.resolves({ items: ["foo", "bar"] });

            const playlist = new Playlist({ send: fake });
            const result = await playlist.getItems();
            assert.deepStrictEqual(result, ["foo", "bar"]);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.GetItems",
                { playlistid: 1, properties: ["file"] },
            ]);
        });

        it("should return an empty array when no items", async function () {
            const fake = sinon.fake.resolves({});

            const playlist = new Playlist({ send: fake });
            const result = await playlist.getItems();
            assert.deepStrictEqual(result, []);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.GetItems",
                { playlistid: 1, properties: ["file"] },
            ]);
        });
    });

    describe("getItem()", function () {
        it("should return item", async function () {
            const fake = sinon.fake.resolves({ items: ["foo"] });

            const playlist = new Playlist({ send: fake });
            const position = 42;
            const result = await playlist.getItem(position);
            assert.strictEqual(result, "foo");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file"],
                    limits:     { start: 42, end: 43 },
                },
            ]);
        });

        it("should return null when no item", async function () {
            const fake = sinon.fake.resolves({});

            const playlist = new Playlist({ send: fake });
            const position = 42;
            const result = await playlist.getItem(position);
            assert.strictEqual(result, null);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.GetItems",
                {
                    playlistid: 1,
                    properties: ["file"],
                    limits:     { start: 42, end: 43 },
                },
            ]);
        });
    });

    describe("insert()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const playlist = new Playlist({ send: fake });
            const file = "foo";
            const position = 42;
            const result = await playlist.insert(file, position);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.Insert",
                { playlistid: 1, position, item: { file } },
            ]);
        });
    });

    describe("remove()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const playlist = new Playlist({ send: fake });
            const position = 42;
            const result = await playlist.remove(position);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Playlist.Remove",
                { playlistid: 1, position },
            ]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function (done) {
            const playlist = new Playlist({ send: Function.prototype });
            playlist.onAdd.addListener(assert.fail);
            playlist.onClear.addListener(assert.fail);
            playlist.onRemove.addListener(assert.fail);
            playlist.handleNotification({
                method: "Other.OnAdd",
                params: { data: { playlistid: 1 } },
            });
            done();
        });

        it("should ignore others playlists", function (done) {
            const playlist = new Playlist({ send: Function.prototype });
            playlist.onAdd.addListener(assert.fail);
            playlist.onClear.addListener(assert.fail);
            playlist.onRemove.addListener(assert.fail);
            playlist.handleNotification({
                method: "Playlist.OnAdd",
                params: { data: { playlistid: 2 } },
            });
            done();
        });

        it("should call 'onAdd' listeners", function (done) {
            const playlist = new Playlist({ send: Function.prototype });
            playlist.onAdd.addListener((data) => {
                assert.deepStrictEqual(data, { playlistid: 1, foo: "bar" });
                done();
            });
            playlist.handleNotification({
                method: "Playlist.OnAdd",
                params: { data: { playlistid: 1, foo: "bar" } },
            });
            assert.fail();
        });

        it("should call 'onClear' listeners", function (done) {
            const playlist = new Playlist({ send: Function.prototype });
            playlist.onClear.addListener((data) => {
                assert.deepStrictEqual(data, { playlistid: 1, foo: "bar" });
                done();
            });
            playlist.handleNotification({
                method: "Playlist.OnClear",
                params: { data: { playlistid: 1, foo: "bar" } },
            });
            assert.fail();
        });

        it("should call 'onRemove' listeners", function (done) {
            const playlist = new Playlist({ send: Function.prototype });
            playlist.onRemove.addListener((data) => {
                assert.deepStrictEqual(data, { playlistid: 1, foo: "bar" });
                done();
            });
            playlist.handleNotification({
                method: "Playlist.OnRemove",
                params: { data: { playlistid: 1, foo: "bar" } },
            });
            assert.fail();
        });

        it("should ignore others notifications", function (done) {
            const playlist = new Playlist({ send: Function.prototype });
            playlist.onAdd.addListener(assert.fail);
            playlist.onClear.addListener(assert.fail);
            playlist.onRemove.addListener(assert.fail);
            playlist.handleNotification({
                method: "Playlist.Other",
                params: { data: { playlistid: 1 } },
            });
            done();
        });
    });
});
