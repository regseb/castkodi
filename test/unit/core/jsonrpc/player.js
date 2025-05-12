/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { Kodi } from "../../../../src/core/jsonrpc/kodi.js";
import { Player } from "../../../../src/core/jsonrpc/player.js";
import { NotificationEvent } from "../../../../src/core/tools/notificationevent.js";

describe("core/jsonrpc/player.js", function () {
    describe("addSubtitle()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.addSubtitle("foo");
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.AddSubtitle",
                { playerid: 1, subtitle: "foo" },
            ]);
        });
    });

    describe("getProperties()", function () {
        it("should return properties when no player is active", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves([]);

            const player = new Player(kodi);
            const properties = [
                "active",
                "position",
                "repeat",
                "shuffled",
                "speed",
                "time",
                "totaltime",
            ];
            const result = await player.getProperties(properties);
            assert.deepEqual(result, {
                active: false,
                position: -1,
                repeat: "off",
                shuffled: false,
                speed: 0,
                time: 0,
                totaltime: 0,
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["Player.GetActivePlayers"]);
        });

        it("should return properties when video player is active", async function () {
            const kodi = new Kodi();
            const stub = sinon
                .stub(kodi, "send")
                .onFirstCall()
                .resolves([{ playerid: 1 }])
                .onSecondCall()
                .resolves({
                    position: 42,
                    repeat: "all",
                    shuffled: true,
                    speed: 2,
                    time: { hours: 1, minutes: 2, seconds: 3 },
                    totaltime: { hours: 0, minutes: 0, seconds: 0 },
                });

            const player = new Player(kodi);
            const properties = [
                "active",
                "position",
                "repeat",
                "shuffled",
                "speed",
                "time",
                "totaltime",
            ];
            const result = await player.getProperties(properties);
            assert.deepEqual(result, {
                active: true,
                position: 42,
                repeat: "all",
                shuffled: true,
                speed: 2,
                time: 3723,
                totaltime: 0,
            });

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, ["Player.GetActivePlayers"]);
            assert.deepEqual(stub.secondCall.args, [
                "Player.GetProperties",
                {
                    playerid: 1,
                    properties: [
                        "position",
                        "repeat",
                        "shuffled",
                        "speed",
                        "time",
                        "totaltime",
                    ],
                },
            ]);
        });

        it("should return default properties when an other player is active", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves([{ playerid: 0 }]);

            const player = new Player(kodi);
            const properties = ["active", "position", "repeat", "shuffled"];
            const result = await player.getProperties(properties);
            assert.deepEqual(result, {
                active: false,
                position: -1,
                repeat: "off",
                shuffled: false,
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["Player.GetActivePlayers"]);
        });

        it(`shouldn't return "active"`, async function () {
            const kodi = new Kodi();
            const stub = sinon
                .stub(kodi, "send")
                .onFirstCall()
                .resolves([{ playerid: 1 }])
                .onSecondCall()
                .resolves({ position: 42 });

            const player = new Player(kodi);
            const properties = ["position"];
            const result = await player.getProperties(properties);
            assert.deepEqual(result, { position: 42 });

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, ["Player.GetActivePlayers"]);
            assert.deepEqual(stub.secondCall.args, [
                "Player.GetProperties",
                { playerid: 1, properties: ["position"] },
            ]);
        });
    });

    describe("getProperty()", function () {
        it("should return lambda property", async function () {
            const kodi = new Kodi();
            const stub = sinon
                .stub(kodi, "send")
                .onFirstCall()
                .resolves([{ playerid: 1 }])
                .onSecondCall()
                .resolves({ foo: "bar" });

            const player = new Player(kodi);
            const property = "foo";
            const result = await player.getProperty(property);
            assert.equal(result, "bar");

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, ["Player.GetActivePlayers"]);
            assert.deepEqual(stub.secondCall.args, [
                "Player.GetProperties",
                { playerid: 1, properties: [property] },
            ]);
        });
    });

    describe("goTo()", function () {
        it("should send request with 'next'", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.goTo("next");
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.GoTo",
                { playerid: 1, to: "next" },
            ]);
        });

        it("should send request with 'previous'", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.goTo("previous");
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.GoTo",
                { playerid: 1, to: "previous" },
            ]);
        });
    });

    describe("open()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const position = 42;
            const result = await player.open(position);
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.Open",
                { item: { playlistid: 1, position } },
            ]);
        });

        it("should send request without parameter", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.open();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.Open",
                { item: { playlistid: 1, position: 0 } },
            ]);
        });
    });

    describe("playPause()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({ speed: 2 });

            const player = new Player(kodi);
            const result = await player.playPause();
            assert.equal(result, 2);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.PlayPause",
                { playerid: 1 },
            ]);
        });
    });

    describe("seek()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({
                time: { hours: 0, minutes: 1, seconds: 40, milliseconds: 0 },
            });

            const player = new Player(kodi);
            const time = 100;
            const result = await player.seek(time);
            assert.equal(result, 100);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.Seek",
                {
                    playerid: 1,
                    value: {
                        time: {
                            hours: 0,
                            minutes: 1,
                            seconds: 40,
                            milliseconds: 0,
                        },
                    },
                },
            ]);
        });
    });

    describe("setRepeat()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.setRepeat();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.SetRepeat",
                { playerid: 1, repeat: "cycle" },
            ]);
        });
    });

    describe("setShuffle()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.setShuffle();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.SetShuffle",
                { playerid: 1, shuffle: "toggle" },
            ]);
        });
    });

    describe("setSpeed()", function () {
        it("should increment speed", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({ speed: 2 });

            const player = new Player(kodi);
            const speed = "increment";
            const result = await player.setSpeed(speed);
            assert.equal(result, 2);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.SetSpeed",
                { playerid: 1, speed },
            ]);
        });

        it("should decrement speed", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves({ speed: -2 });

            const player = new Player(kodi);
            const speed = "decrement";
            const result = await player.setSpeed(speed);
            assert.equal(result, -2);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.SetSpeed",
                { playerid: 1, speed },
            ]);
        });
    });

    describe("stop()", function () {
        it("should send request", async function () {
            const kodi = new Kodi();
            const stub = sinon.stub(kodi, "send").resolves("OK");

            const player = new Player(kodi);
            const result = await player.stop();
            assert.equal(result, "OK");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "Player.Stop",
                { playerid: 1 },
            ]);
        });
    });

    describe("handleNotification()", function () {
        it("should ignore others namespaces", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    // Utiliser un espace de 6 caractères pour avoir la même
                    // longueur que le mot "Player".
                    method: "123456.OnAVStart",
                    params: { data: null },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 0);
        });

        it("should ignore when no listener", async function () {
            const player = new Player(new Kodi());
            const spy = sinon.spy(player.onPropertyChanged, "dispatch");
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnAVStart",
                    params: { data: { player: { playerid: 1 } } },
                }),
            );

            assert.equal(spy.callCount, 0);
        });

        it("should ignore others players", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnAVStart",
                    params: { data: { player: { playerid: 2 } } },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 0);
        });

        it("should handle 'OnAVStart'", async function () {
            const kodi = new Kodi();
            const stub = sinon
                .stub(kodi, "send")
                .onFirstCall()
                .resolves([{ playerid: 1 }])
                .onSecondCall()
                .resolves({
                    position: 42,
                    repeat: false,
                    shuffled: true,
                    time: { hours: 1, minutes: 2, seconds: 3 },
                    totaltime: { hours: 3, minutes: 2, seconds: 1 },
                });
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnAVStart",
                    params: { data: { player: { playerid: 1, speed: 2 } } },
                }),
            );

            assert.equal(stub.callCount, 2);
            assert.deepEqual(stub.firstCall.args, ["Player.GetActivePlayers"]);
            assert.deepEqual(stub.secondCall.args, [
                "Player.GetProperties",
                {
                    playerid: 1,
                    properties: [
                        "position",
                        "repeat",
                        "shuffled",
                        "time",
                        "totaltime",
                    ],
                },
            ]);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                {
                    active: true,
                    position: 42,
                    repeat: false,
                    shuffled: true,
                    speed: 2,
                    time: 3723,
                    totaltime: 10_921,
                },
            ]);
        });

        it("should handle 'OnPause'", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnPause",
                    params: { data: { player: { playerid: 1, speed: 0 } } },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [{ speed: 0 }]);
        });

        it("should handle 'OnPropertyChanged'", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnPropertyChanged",
                    params: {
                        data: {
                            player: { playerid: 1 },
                            property: { foo: "bar" },
                        },
                    },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [{ foo: "bar" }]);
        });

        it("should handle 'OnResume'", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnResume",
                    params: { data: { player: { playerid: 1, speed: -2 } } },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [{ speed: -2 }]);
        });

        it("should handle 'OnSeek'", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnSeek",
                    params: {
                        data: {
                            player: {
                                playerid: 1,
                                time: { hours: 1, minutes: 2, seconds: 3 },
                            },
                        },
                    },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [{ time: 3723 }]);
        });

        it("should handle 'OnSpeedChanged'", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnSpeedChanged",
                    params: { data: { player: { playerid: 1, speed: 32 } } },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [{ speed: 32 }]);
        });

        it("should handle 'OnStop'", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.OnStop",
                    params: { data: {} },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                {
                    active: false,
                    position: -1,
                    speed: 0,
                    time: 0,
                    totaltime: 0,
                },
            ]);
        });

        it("should ignore others notifications", async function () {
            const kodi = new Kodi();
            const spy = sinon.spy(kodi, "send");
            const fake = sinon.fake();

            const player = new Player(kodi);
            player.onPropertyChanged.addListener(fake);
            await player.handleNotification(
                new NotificationEvent("notification", {
                    method: "Player.Other",
                    params: { data: { player: { playerid: 1 } } },
                }),
            );

            assert.equal(spy.callCount, 0);
            assert.equal(fake.callCount, 0);
        });
    });
});
