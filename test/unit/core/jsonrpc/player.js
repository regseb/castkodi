import assert from "node:assert";
import sinon from "sinon";
import { Player } from "../../../../src/core/jsonrpc/player.js";

describe("core/jsonrpc/player.js", function () {
    describe("getProperties()", function () {
        it("should return properties when no player is active",
                                                             async function () {
            const fake = sinon.fake((method) => {
                switch (method) {
                    case "Player.GetActivePlayers":
                        return Promise.resolve([]);
                    case "Player.GetProperties":
                        return Promise.resolve({
                            foo:       "bar",
                            baz:       42,
                            qux:       true,
                            time:      { hours: 1, minutes: 2, seconds: 3 },
                            totaltime: { hours: 0, minutes: 0, seconds: 0 },
                        });
                    default:
                        return Promise.reject(new Error(method));
                }
            });

            const player = new Player({ send: fake });
            const properties = ["foo", "baz", "quz", "time", "totaltime"];
            const result = await player.getProperties(properties);
            assert.deepStrictEqual(result, {
                position:  -1,
                repeat:    "off",
                shuffled:  false,
                speed:     0,
                time:      0,
                totaltime: 0,
            });

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetActivePlayers",
            ]);
        });

        it("should return properties when video player is active",
                                                             async function () {
            const fake = sinon.fake((method) => {
                switch (method) {
                    case "Player.GetActivePlayers":
                        return Promise.resolve([{ playerid: 1 }]);
                    case "Player.GetProperties":
                        return Promise.resolve({
                            foo:       "bar",
                            baz:       42,
                            qux:       true,
                            time:      { hours: 1, minutes: 2, seconds: 3 },
                            totaltime: { hours: 0, minutes: 0, seconds: 0 },
                        });
                    default:
                        return Promise.reject(new Error(method));
                }
            });

            const player = new Player({ send: fake });
            const properties = ["foo", "baz", "quz", "time", "totaltime"];
            const result = await player.getProperties(properties);
            assert.deepStrictEqual(result, {
                foo:       "bar",
                baz:       42,
                qux:       true,
                time:      3723,
                totaltime: 0,
            });

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetActivePlayers",
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                "Player.GetProperties",
                {
                    playerid:   1,
                    properties: ["foo", "baz", "quz", "time", "totaltime"],
                },
            ]);
        });

        it("should return default properties when an other player is active",
                                                             async function () {
            const fake = sinon.fake.resolves([{ playerid: 0 }]);

            const player = new Player({ send: fake });
            const properties = ["foo"];
            const result = await player.getProperties(properties);
            assert.deepStrictEqual(result, {
                position:  -1,
                repeat:    "off",
                shuffled:  false,
                speed:     0,
                time:      0,
                totaltime: 0,
            });

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetActivePlayers",
            ]);
        });
    });

    describe("getProperty()", function () {
        it("should return lambda property", async function () {
            const fake = sinon.fake((method) => {
                switch (method) {
                    case "Player.GetActivePlayers":
                        return Promise.resolve([{ playerid: 1 }]);
                    case "Player.GetProperties":
                        return Promise.resolve({ foo: "bar" });
                    default:
                        return Promise.reject(new Error(method));
                }
            });

            const player = new Player({ send: fake });
            const property = "foo";
            const result = await player.getProperty(property);
            assert.strictEqual(result, "bar");

            assert.strictEqual(fake.callCount, 2);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetActivePlayers",
            ]);
            assert.deepStrictEqual(fake.secondCall.args, [
                "Player.GetProperties",
                { playerid: 1, properties: [property] },
            ]);
        });
    });

    describe("goTo()", function () {
        it("should send request with 'next'", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.goTo("next");
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GoTo",
                { playerid: 1, to: "next" },
            ]);
        });

        it("should send request with 'previous'", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.goTo("previous");
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GoTo",
                { playerid: 1, to: "previous" },
            ]);
        });
    });

    describe("open()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const position = 42;
            const result = await player.open(position);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.Open",
                { item: { playlistid: 1, position } },
            ]);
        });

        it("should send request without parameter", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.open();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.Open",
                { item: { playlistid: 1, position: 0 } },
            ]);
        });
    });

    describe("playPause()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves({ speed: 2 });

            const player = new Player({ send: fake });
            const result = await player.playPause();
            assert.strictEqual(result, 2);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.PlayPause",
                { playerid: 1 },
            ]);
        });
    });

    describe("seek()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves({
                time: { hours: 0, minutes: 1, seconds: 40, milliseconds: 0 },
            });

            const player = new Player({ send: fake });
            const time = 100;
            const result = await player.seek(time);
            assert.strictEqual(result, 100);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.Seek",
                {
                    playerid: 1,
                    value:    {
                        time: {
                            hours:        0,
                            minutes:      1,
                            seconds:      40,
                            milliseconds: 0,
                        },
                    },
                },
            ]);
        });
    });

    describe("setRepeat()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.setRepeat();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.SetRepeat",
                { playerid: 1, repeat: "cycle" },
            ]);
        });
    });

    describe("setShuffle()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.setShuffle();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.SetShuffle",
                { playerid: 1, shuffle: "toggle" },
            ]);
        });
    });

    describe("setSpeed()", function () {
        it("should increment speed", async function () {
            const fake = sinon.fake.resolves({ speed: 2 });

            const player = new Player({ send: fake });
            const speed = "increment";
            const result = await player.setSpeed(speed);
            assert.strictEqual(result, 2);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.SetSpeed",
                { playerid: 1, speed },
            ]);
        });

        it("should decrement speed", async function () {
            const fake = sinon.fake.resolves({ speed: -2 });

            const player = new Player({ send: fake });
            const speed = "decrement";
            const result = await player.setSpeed(speed);
            assert.strictEqual(result, -2);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.SetSpeed",
                { playerid: 1, speed },
            ]);
        });
    });

    describe("stop()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.stop();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.Stop",
                { playerid: 1 },
            ]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener(assert.fail);
            player.handleNotification({
                method: "Other.OnAVStart",
                params: { data: { player: { playerid: 1 } } },
            });
            done();
        });

        it("should ignore others players", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener(assert.fail);
            player.handleNotification({
                method: "Player.OnAVStart",
                params: { data: { player: { playerid: 2 } } },
            });
            done();
        });

        it("should ignore when no listener", async function () {
            const fake = sinon.fake.rejects(new Error("foo"));

            const player = new Player({ send: fake });
            await player.handleNotification({
                method: "Player.OnAVStart",
                params: { data: { player: { playerid: 1 } } },
            });

            assert.strictEqual(fake.callCount, 0);
        });

        it("should handle 'OnAVStart'", function (done) {
            const fake = sinon.fake((method) => {
                switch (method) {
                    case "Player.GetActivePlayers":
                        return Promise.resolve([{ playerid: 1 }]);
                    case "Player.GetProperties":
                        return Promise.resolve({
                            position:  42,
                            time:      { hours: 1, minutes: 2, seconds: 3 },
                            totaltime: { hours: 3, minutes: 2, seconds: 1 },
                        });
                    default:
                        return Promise.reject(new Error(method));
                }
            });

            const player = new Player({ send: fake });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, {
                    position:  42,
                    speed:     2,
                    time:      3723,
                    totaltime: 10_921,
                });

                assert.strictEqual(fake.callCount, 2);
                assert.deepStrictEqual(fake.firstCall.args, [
                    "Player.GetActivePlayers",
                ]);
                assert.deepStrictEqual(fake.secondCall.args, [
                    "Player.GetProperties",
                    {
                        playerid:   1,
                        properties: ["position", "time", "totaltime"],
                    },
                ]);

                done();
            });
            player.handleNotification({
                method: "Player.OnAVStart",
                params: { data: { player: { playerid: 1, speed: 2 } } },
            });
        });

        it("should handle 'OnPause'", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { speed: 0 });
                done();
            });
            player.handleNotification({
                method: "Player.OnPause",
                params: { data: { player: { playerid: 1, speed: 0 } } },
            });
            assert.fail();
        });

        it("should handle 'OnPropertyChanged'", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { foo: "bar" });
                done();
            });
            player.handleNotification({
                method: "Player.OnPropertyChanged",
                params: {
                    data: { player: { playerid: 1 }, property: { foo: "bar" } },
                },
            });
            assert.fail();
        });

        it("should handle 'OnResume'", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { speed: -2 });
                done();
            });
            player.handleNotification({
                method: "Player.OnResume",
                params: { data: { player: { playerid: 1, speed: -2 } } },
            });
            assert.fail();
        });

        it("should handle 'OnSeek'", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { time: 3723 });
                done();
            });
            player.handleNotification({
                method: "Player.OnSeek",
                params: {
                    data: {
                        player: {
                            playerid: 1,
                            time:     { hours: 1, minutes: 2, seconds: 3 },
                        },
                    },
                },
            });
            assert.fail();
        });

        it("should handle 'OnSpeedChanged'", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, { speed: 32 });
                done();
            });
            player.handleNotification({
                method: "Player.OnSpeedChanged",
                params: { data: { player: { playerid: 1, speed: 32 } } },
            });
            assert.fail();
        });

        it("should handle 'OnStop'", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener((data) => {
                assert.deepStrictEqual(data, {
                    position:  -1,
                    speed:     0,
                    time:      0,
                    totaltime: 0,
                });
                done();
            });
            player.handleNotification({
                method: "Player.OnStop",
                params: { data: {} },
            });
            assert.fail();
        });

        it("should ignore others notifications", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPropertyChanged.addListener(assert.fail);
            player.handleNotification({
                method: "Player.Other",
                params: { data: { player: { playerid: 1 } } },
            });
            done();
        });
    });
});
