import assert      from "assert";
import { Server }  from "mock-socket";
import { JSONRPC } from "../../../src/core/jsonrpc.js";

describe("core/jsonrpc.js", function () {
    describe("check()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    socket.send(JSON.stringify({
                        id:     JSON.parse(data).id,
                        result: null,
                    }));
                });
            });

            const result = await JSONRPC.check("localhost");
            assert.strictEqual(result, undefined);

            server.close();
        });

        it("should return error when no host", async function () {
            const expected = "unconfigured";
            try {
                await JSONRPC.check("");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            }
        });

        it("should return error when host is invalid", async function () {
            const expected = "badHost";
            try {
                await JSONRPC.check("bad host");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            }
        });

        it("should return error when IP is invalid", async function () {
            const expected = "badHost";
            try {
                await JSONRPC.check("192.168");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            }
        });

        it("should return error when receive 400", async function () {
            const expected = "notFound";
            try {
                await JSONRPC.check("localhost");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            }
        });

        it("should return error when receive Kodi's error", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    socket.send(JSON.stringify({
                        id:    JSON.parse(data).id,
                        error: { message: "FooError" },
                    }));
                });
            });

            const expected = "FooError";
            try {
                await JSONRPC.check("localhost");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "Error");
                assert.strictEqual(err.message, expected);
            }

            server.close();
        });
    });

    describe("close()", function () {
        it("should close WebSocket", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    socket.send(JSON.stringify({
                        id:     JSON.parse(data).id,
                        result: null,
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            await jsonrpc.version();
            jsonrpc.close();

            server.close();
        });

        it("should do nothing with WebSocket doesn't open", function () {
            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.close();
        });
    });

    describe("add()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Playlist.Add");
                    assert.deepStrictEqual(msg.params, {
                        playlistid: 1, item: { file: "foo" },
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const file = "foo";
            const result = await jsonrpc.add(file);
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("send()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    switch (msg.id) {
                        case 1:
                            assert.strictEqual(msg.method, "Playlist.Clear");
                            assert.deepStrictEqual(msg.params, {
                                playlistid: 1,
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: "OK",
                            }));
                            break;
                        case 2:
                            assert.strictEqual(msg.method, "Playlist.Add");
                            assert.deepStrictEqual(msg.params, {
                                playlistid: 1, item: { file: "foo" },
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: "OK",
                            }));
                            break;
                        case 3:
                            assert.strictEqual(msg.method, "Player.Open");
                            assert.deepStrictEqual(msg.params, {
                                item: { playlistid: 1 },
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: "OK",
                            }));
                            break;
                        default:
                            assert.fail(JSON.stringify(msg));
                    }
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const file = "foo";
            const result = await jsonrpc.send(file);
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("insert()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    switch (msg.id) {
                        case 1:
                            assert.strictEqual(msg.method,
                                               "Player.GetProperties");
                            assert.deepStrictEqual(msg.params, {
                                playerid:   1,
                                properties: ["position"],
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: { position: 1337 },
                            }));
                            break;
                        case 2:
                            assert.strictEqual(msg.method, "Playlist.Insert");
                            assert.deepStrictEqual(msg.params, {
                                playlistid: 1,
                                position:   1338,
                                item:       { file: "foo" },
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: "OK",
                            }));
                            break;
                        default:
                            assert.fail(JSON.stringify(msg));
                    }
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const file = "foo";
            const result = await jsonrpc.insert(file);
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("previous()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.GoTo");
                    assert.deepStrictEqual(msg.params, {
                        playerid: 1,
                        to:       "previous",
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.previous();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("stop()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.Stop");
                    assert.deepStrictEqual(msg.params, { playerid: 1 });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.stop();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("open()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.Open");
                    assert.deepStrictEqual(msg.params, {
                        item: { playlistid: 1 },
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.open();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("playPause()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.PlayPause");
                    assert.deepStrictEqual(msg.params, { playerid: 1 });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.playPause();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("seek()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.Seek");
                    assert.deepStrictEqual(msg.params, {
                        playerid: 1,
                        value:    {
                            time: {
                                hours:        0,
                                minutes:      1,
                                seconds:      40,
                                milliseconds: 0,
                            },
                        },
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.seek(100);
            assert.deepStrictEqual(result, "OK");

            server.close();
        });
    });

    describe("next()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.GoTo");
                    assert.deepStrictEqual(msg.params, {
                        playerid: 1,
                        to:       "next",
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.next();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("setSpeed()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.SetSpeed");
                    assert.deepStrictEqual(msg.params, {
                        playerid: 1,
                        speed:    32,
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const speed = 32;
            const result = await jsonrpc.setSpeed(speed);
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("setMute()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Application.SetMute");
                    assert.deepStrictEqual(msg.params, { mute: true });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const mute = true;
            const result = await jsonrpc.setMute(mute);
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("setVolume()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    switch (msg.id) {
                        case 1:
                            assert.strictEqual(msg.method,
                                               "Application.SetMute");
                            assert.deepStrictEqual(msg.params, { mute: false });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: "OK",
                            }));
                            break;
                        case 2:
                            assert.strictEqual(msg.method,
                                               "Application.SetVolume");
                            assert.deepStrictEqual(msg.params, { volume: 51 });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: "OK",
                            }));
                            break;
                        default:
                            assert.fail(JSON.stringify(msg));
                    }
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const volume = 51;
            const result = await jsonrpc.setVolume(volume);
            assert.deepStrictEqual(result, ["OK", "OK"]);

            server.close();
        });
    });

    describe("setRepeat()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.SetRepeat");
                    assert.deepStrictEqual(msg.params, {
                        playerid: 1,
                        repeat:   "cycle",
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.setRepeat();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("setShuffle()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Player.SetShuffle");
                    assert.deepStrictEqual(msg.params, {
                        playerid: 1,
                        shuffle:  true,
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const shuffle = true;
            const result = await jsonrpc.setShuffle(shuffle);
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("clear()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Playlist.Clear");
                    assert.deepStrictEqual(msg.params, { playlistid: 1 });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.clear();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("contextMenu()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.ContextMenu");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.contextMenu();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("up()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Up");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.up();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("info()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Info");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.info();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("left()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Left");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.left();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("select()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Select");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.select();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("right()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Right");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.right();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("back()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Back");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.back();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("down()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.Down");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.down();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("showOSD()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "Input.ShowOSD");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.showOSD();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("setFullscreen()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "GUI.SetFullscreen");
                    assert.deepStrictEqual(msg.params, {
                        fullscreen: "toggle",
                    });
                    socket.send(JSON.stringify({ id: msg.id, result: "OK" }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.setFullscreen();
            assert.strictEqual(result, "OK");

            server.close();
        });
    });

    describe("version()", function () {
        it("should send request", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    assert.strictEqual(msg.method, "JSONRPC.Version");
                    assert.deepStrictEqual(msg.params, {});
                    socket.send(JSON.stringify({
                        id:     msg.id,
                        result: { version: { major: 10, minor: 3, patch: 0 } },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.version();
            assert.deepStrictEqual(result, {
                version: { major: 10, minor: 3, patch: 0 },
            });

            server.close();
        });
    });

    describe("getProperties()", function () {
        it("should get properties when no player active", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    switch (msg.id) {
                        case 1:
                            assert.strictEqual(msg.method,
                                               "Application.GetProperties");
                            assert.deepStrictEqual(msg.params, {
                                properties: ["muted", "volume"],
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: { muted: false, volume: 51 },
                            }));
                            break;
                        case 2:
                            assert.strictEqual(msg.method,
                                               "Player.GetActivePlayers");
                            assert.deepStrictEqual(msg.params, {});
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: [],
                            }));
                            break;
                        default:
                            assert.fail(JSON.stringify(msg));
                    }
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.getProperties();
            assert.deepStrictEqual(result, {
                muted:     false,
                volume:    51,
                repeat:    "off",
                shuffled:  false,
                speed:     null,
                time:      0,
                totaltime: 0,
            });

            server.close();
        });

        it("should get properties when other player active", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    switch (msg.id) {
                        case 1:
                            assert.strictEqual(msg.method,
                                               "Application.GetProperties");
                            assert.deepStrictEqual(msg.params, {
                                properties: ["muted", "volume"],
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: { muted: true, volume: 0 },
                            }));
                            break;
                        case 2:
                            assert.strictEqual(msg.method,
                                               "Player.GetActivePlayers");
                            assert.deepStrictEqual(msg.params, {});
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: [{ playerid: 2 }],
                            }));
                            break;
                        default:
                            assert.fail(JSON.stringify(msg));
                    }
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.getProperties();
            assert.deepStrictEqual(result, {
                muted:     true,
                volume:    0,
                repeat:    "off",
                shuffled:  false,
                speed:     null,
                time:      0,
                totaltime: 0,
            });

            server.close();
        });

        it("should get properties when video player active", async function () {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", (data) => {
                    const msg = JSON.parse(data);
                    switch (msg.id) {
                        case 1:
                            assert.strictEqual(msg.method,
                                               "Application.GetProperties");
                            assert.deepStrictEqual(msg.params, {
                                properties: ["muted", "volume"],
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: { muted: false, volume: 100 },
                            }));
                            break;
                        case 2:
                            assert.strictEqual(msg.method,
                                               "Player.GetActivePlayers");
                            assert.deepStrictEqual(msg.params, {});
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: [{ playerid: 1 }],
                            }));
                            break;
                        case 3:
                            assert.strictEqual(msg.method,
                                               "Player.GetProperties");
                            assert.deepStrictEqual(msg.params, {
                                playerid:   1,
                                properties: [
                                    "repeat", "shuffled", "speed", "time",
                                    "totaltime",
                                ],
                            });
                            socket.send(JSON.stringify({
                                id:     msg.id,
                                result: {
                                    repeat:    "one",
                                    shuffled:  true,
                                    speed:     1,
                                    time:      {
                                        hours: 0, minutes: 1, seconds: 2,
                                    },
                                    totaltime: {
                                        hours: 1, minutes: 2, seconds: 3,
                                    },
                                },
                            }));
                            break;
                        default:
                            assert.fail(JSON.stringify(msg));
                    }
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            const result = await jsonrpc.getProperties();
            assert.deepStrictEqual(result, {
                muted:     false,
                volume:    100,
                repeat:    "one",
                shuffled:  true,
                speed:     1,
                time:      62,
                totaltime: 3723,
            });

            server.close();
        });
    });

    describe("onVolumeChanged()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Application.OnVolumeChanged",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onVolumeChanged = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.setMute();
        });
    });

    describe("onAVStart()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnAVStart",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onAVStart = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.open();
        });
    });

    describe("onPause()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnPause",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onPause = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.playPause();
        });
    });

    describe("onPlay()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnPlay",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onPlay = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.playPause();
        });
    });

    describe("onPropertyChanged()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnPropertyChanged",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onPropertyChanged = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.playPause();
        });
    });

    describe("onResume()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnResume",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onResume = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.playPause();
        });
    });

    describe("onSeek()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnSeek",
                        params: {
                            data: {
                                item:   "Foo",
                                player: {
                                    playerid: 1,
                                    speed:    -2,
                                    time:     {
                                        hours:   1,
                                        minutes: 2,
                                        seconds: 3,
                                    },
                                },
                            },
                        },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onSeek = (data) => {
                assert.deepStrictEqual(data, {
                    item:   "Foo",
                    player: {
                        playerid: 1,
                        speed:    -2,
                        time:     3723,
                    },
                });
                done();
                server.close();
            };
            jsonrpc.seek(60);
        });
    });

    describe("onSpeedChanged()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnSpeedChanged",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onSpeedChanged = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.setSpeed(2);
        });
    });

    describe("onStop()", function () {
        it("should receive event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "Player.OnStop",
                        params: { data: "foo" },
                    }));
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onStop = (data) => {
                assert.strictEqual(data, "foo");
                done();
                server.close();
            };
            jsonrpc.stop();
        });
    });

    describe("onQuit()", function () {
        it("should ignore event", function (done) {
            const server = new Server("ws://localhost:9090/jsonrpc");
            server.on("connection", (socket) => {
                socket.on("message", () => {
                    socket.send(JSON.stringify({
                        method: "System.OnQuit",
                        params: { data: "foo" },
                    }));
                    done();
                });
            });

            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.onVolumeChanged   = assert.fail;
            jsonrpc.onPause           = assert.fail;
            jsonrpc.onPlay            = assert.fail;
            jsonrpc.onPropertyChanged = assert.fail;
            jsonrpc.onResume          = assert.fail;
            jsonrpc.onSeek            = assert.fail;
            jsonrpc.onSpeedChanged    = assert.fail;
            jsonrpc.onStop            = assert.fail;
            jsonrpc.open();
        });
    });
});
