import assert     from "assert";
import sinon      from "sinon";
import { Player } from "../../../../src/core/jsonrpc/player.js";

describe("core/jsonrpc/player.js", function () {
    describe("getProperties()", function () {
        it("should return properties", async function () {
            const fake = sinon.fake.resolves({
                foo:       "bar",
                baz:       42,
                qux:       true,
                time:      { hours: 1, minutes: 2, seconds: 3 },
                totaltime: { hours: 0, minutes: 0, seconds: 0 },
            });

            const player = new Player({ send: fake });
            const properties = [
                "foo", "baz", "quz", "timestamp", "totaltimestamp",
            ];
            const result = await player.getProperties(properties);
            assert.deepStrictEqual(result, {
                foo:            "bar",
                baz:            42,
                qux:            true,
                timestamp:      3723,
                totaltimestamp: 0,
            });

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetProperties",
                {
                    playerid:   1,
                    properties: ["foo", "baz", "quz", "time", "totaltime"],
                },
            ]);
        });
    });

    describe("getProperty()", function () {
        it("should return lambda property", async function () {
            const fake = sinon.fake.resolves({ foo: "bar" });

            const player = new Player({ send: fake });
            const property = "foo";
            const result = await player.getProperty(property);
            assert.strictEqual(result, "bar");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetProperties",
                { playerid: 1, properties: [property] },
            ]);
        });

        it("should return timestamp property", async function () {
            const fake = sinon.fake.resolves({
                time: { hours: 3, minutes: 2, seconds: 1 },
            });

            const player = new Player({ send: fake });
            const property = "timestamp";
            const result = await player.getProperty(property);
            assert.strictEqual(result, 10921);

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GetProperties",
                { playerid: 1, properties: ["time"] },
            ]);
        });
    });

    describe("next()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.next();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GoTo",
                { playerid: 1, to: "next" },
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

    describe("previous()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves("OK");

            const player = new Player({ send: fake });
            const result = await player.previous();
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.GoTo",
                { playerid: 1, to: "previous" },
            ]);
        });
    });

    describe("seek()", function () {
        it("should send request", async function () {
            const fake = sinon.fake.resolves({
                time: { hours: 0, minutes: 1, seconds: 40, milliseconds: 0 },
            });

            const player = new Player({ send: fake });
            const timestamp = 100;
            const result = await player.seek(timestamp);
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
            const shuffle = false;
            const result = await player.setShuffle(shuffle);
            assert.strictEqual(result, "OK");

            assert.strictEqual(fake.callCount, 1);
            assert.deepStrictEqual(fake.firstCall.args, [
                "Player.SetShuffle",
                { playerid: 1, shuffle },
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
            player.onAVStart.addListener(assert.fail);
            player.onPause.addListener(assert.fail);
            player.onPlay.addListener(assert.fail);
            player.onPropertyChanged.addListener(assert.fail);
            player.onResume.addListener(assert.fail);
            player.onSeek.addListener(assert.fail);
            player.onSpeedChanged.addListener(assert.fail);
            player.onStop.addListener(assert.fail);
            player.handleNotification({
                method: "Other.onAVStart",
                params: { data: { player: { playerid: 1 } } },
            });
            done();
        });

        it("should ignore others players", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onAVStart.addListener(assert.fail);
            player.onPause.addListener(assert.fail);
            player.onPlay.addListener(assert.fail);
            player.onPropertyChanged.addListener(assert.fail);
            player.onResume.addListener(assert.fail);
            player.onSeek.addListener(assert.fail);
            player.onSpeedChanged.addListener(assert.fail);
            player.onStop.addListener(assert.fail);
            player.handleNotification({
                method: "Player.onAVStart",
                params: { data: { player: { playerid: 2 } } },
            });
            done();
        });

        it("should call 'onAVStart' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onAVStart.addListener((data) => {
                assert.strictEqual(data, 2);
                done();
            });
            player.handleNotification({
                method: "Player.OnAVStart",
                params: { data: { player: { playerid: 1, speed: 2 } } },
            });
            assert.fail();
        });

        it("should call 'onPause' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPause.addListener((data) => {
                assert.strictEqual(data, 0);
                done();
            });
            player.handleNotification({
                method: "Player.OnPause",
                params: { data: { player: { playerid: 1, speed: 0 } } },
            });
            assert.fail();
        });

        it("should call 'onPlay' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onPlay.addListener((data) => {
                assert.strictEqual(data, 8);
                done();
            });
            player.handleNotification({
                method: "Player.OnPlay",
                params: { data: { player: { playerid: 1, speed: 8 } } },
            });
            assert.fail();
        });

        it("should call 'onPropertyChanged' listeners", function (done) {
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

        it("should call 'onResume' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onResume.addListener((data) => {
                assert.strictEqual(data, -2);
                done();
            });
            player.handleNotification({
                method: "Player.OnResume",
                params: { data: { player: { playerid: 1, speed: -2 } } },
            });
            assert.fail();
        });

        it("should call 'onSeek' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onSeek.addListener((data) => {
                assert.strictEqual(data, 3723);
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

        it("should call 'onSpeedChanged' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onSpeedChanged.addListener((data) => {
                assert.strictEqual(data, 32);
                done();
            });
            player.handleNotification({
                method: "Player.OnSpeedChanged",
                params: { data: { player: { playerid: 1, speed: 32 } } },
            });
            assert.fail();
        });

        it("should call 'onStop' listeners", function (done) {
            const player = new Player({ send: Function.prototype });
            player.onStop.addListener((data) => {
                assert.strictEqual(data, null);
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
            player.onAVStart.addListener(assert.fail);
            player.onPause.addListener(assert.fail);
            player.onPlay.addListener(assert.fail);
            player.onPropertyChanged.addListener(assert.fail);
            player.onResume.addListener(assert.fail);
            player.onSeek.addListener(assert.fail);
            player.onSpeedChanged.addListener(assert.fail);
            player.onStop.addListener(assert.fail);
            player.handleNotification({
                method: "Player.Other",
                params: { data: { player: { playerid: 1 } } },
            });
            done();
        });
    });
});
