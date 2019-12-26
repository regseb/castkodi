import assert      from "assert";
import { JSONRPC } from "../../../src/core/jsonrpc.js";

describe("core/jsonrpc.js", function () {
    describe("check()", function () {
        it("should send request", function () {
            // Vérifier que la méthode check() retourne une promesse tenue.
            return JSONRPC.check("locahost");
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
                await JSONRPC.check("notfound.com");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            }
        });

        it("should return error when receive Kodi's error", async function () {
            const expected = "Error message!";
            try {
                await JSONRPC.check("error.com");
                assert.fail();
            } catch (err) {
                assert.strictEqual(err.name, "Error");
                assert.strictEqual(err.message, expected);
            }
        });
    });

    describe("close()", function () {
        it("should close WebSocket", async function () {
            const jsonrpc = new JSONRPC("localhost");
            await jsonrpc.version();
            jsonrpc.close();
        });

        it("should do nothing with WebSocket doesn't open", function () {
            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.close();
        });
    });

    describe("add()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const file = "Le fichier";

            const result = await jsonrpc.add(file);
            assert.deepStrictEqual(result, {
                "method": "Playlist.Add",
                "params": { "playlistid": 1, "item": { file } }
            });
        });
    });

    describe("send()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const file = "Le fichier";

            const result = await jsonrpc.send(file);
            assert.deepStrictEqual(result, {
                "method": "Player.Open",
                "params": {  "item": { "playlistid": 1 } }
            });
        });
    });

    describe("insert()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const file = "Le fichier";

            const result = await jsonrpc.insert(file);
            assert.deepStrictEqual(result, {
                "method": "Playlist.Insert",
                "params": {
                    "playlistid": 1,
                    "position":   null,
                    "item":       { file }
                }
            });
        });
    });

    describe("previous()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.previous();
            assert.deepStrictEqual(result, {
                "method": "Player.GoTo",
                "params": { "playerid": 1, "to": "previous" }
            });
        });
    });

    describe("stop()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.stop();
            assert.deepStrictEqual(result, {
                "method": "Player.Stop",
                "params": { "playerid": 1 }
            });
        });
    });

    describe("open()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.open();
            assert.deepStrictEqual(result, {
                "method": "Player.Open",
                "params": { "item": { "playlistid": 1 } }
            });
        });
    });

    describe("playPause()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.playPause();
            assert.deepStrictEqual(result, {
                "method": "Player.PlayPause",
                "params": { "playerid": 1 }
            });
        });
    });

    describe("seek()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.seek(100);
            assert.deepStrictEqual(result, {
                "method": "Player.Seek",
                "params": {
                    "playerid": 1,
                    "value":    {
                        "time": {
                            "hours":        0,
                            "minutes":      1,
                            "seconds":      40,
                            "milliseconds": 0
                        }
                    }
                }
            });
        });
    });

    describe("next()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.next();
            assert.deepStrictEqual(result, {
                "method": "Player.GoTo",
                "params": { "playerid": 1, "to": "next" }
            });
        });
    });

    describe("setSpeeed()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const speed = 32;

            const result = await jsonrpc.setSpeed(speed);
            assert.deepStrictEqual(result, {
                "method": "Player.SetSpeed",
                "params": { "playerid": 1, speed }
            });
        });
    });

    describe("setMute()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const mute = true;

            const result = await jsonrpc.setMute(mute);
            assert.deepStrictEqual(result, {
                "method": "Application.SetMute",
                "params": { mute }
            });
        });
    });

    describe("setVolume()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const volume = 51;

            const result = await jsonrpc.setVolume(volume);
            assert.deepStrictEqual(result, [
                {
                    "method": "Application.SetMute",
                    "params": { "mute": false }
                }, {
                    "method": "Application.SetVolume",
                    "params": { volume }
                }
            ]);
        });
    });

    describe("setRepeat()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.setRepeat();
            assert.deepStrictEqual(result, {
                "method": "Player.SetRepeat",
                "params": { "playerid": 1, "repeat": "cycle" }
            });
        });
    });

    describe("setShuffle()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");
            const shuffle = true;

            const result = await jsonrpc.setShuffle(shuffle);
            assert.deepStrictEqual(result, {
                "method":  "Player.SetShuffle",
                "params":  { "playerid": 1, shuffle }
            });
        });
    });

    describe("clear()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.clear();
            assert.deepStrictEqual(result, {
                "method": "Playlist.Clear",
                "params": { "playlistid": 1 }
            });
        });
    });

    describe("contextMenu()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.contextMenu();
            assert.deepStrictEqual(result, {
                "method": "Input.ContextMenu",
                "params": {}
            });
        });
    });

    describe("up()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.up();
            assert.deepStrictEqual(result, {
                "method": "Input.Up",
                "params": {}
            });
        });
    });

    describe("info()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.info();
            assert.deepStrictEqual(result, {
                "method": "Input.Info",
                "params": {}
            });
        });
    });

    describe("left()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.left();
            assert.deepStrictEqual(result, {
                "method": "Input.Left",
                "params": {}
            });
        });
    });

    describe("select()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.select();
            assert.deepStrictEqual(result, {
                "method": "Input.Select",
                "params": {}
            });
        });
    });

    describe("right()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.right();
            assert.deepStrictEqual(result, {
                "method": "Input.Right",
                "params": {}
            });
        });
    });

    describe("back()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.back();
            assert.deepStrictEqual(result, {
                "method": "Input.Back",
                "params": {}
            });
        });
    });

    describe("down()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.down();
            assert.deepStrictEqual(result, {
                "method": "Input.Down",
                "params": {}
            });
        });
    });

    describe("showOSD()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.showOSD();
            assert.deepStrictEqual(result, {
                "method": "Input.ShowOSD",
                "params": {}
            });
        });
    });

    describe("setFullscreen()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.setFullscreen();
            assert.deepStrictEqual(result, {
                "method": "GUI.SetFullscreen",
                "params": { "fullscreen": "toggle" }
            });
        });
    });

    describe("version()", function () {
        it("should send request", async function () {
            const jsonrpc = new JSONRPC("localhost");

            const result = await jsonrpc.version();
            assert.deepStrictEqual(result, {
                "method": "JSONRPC.Version",
                "params": {}
            });
        });
    });

    describe("getProperties()", function () {
        it("should get properties when no player active", async function () {
            const jsonrpc = new JSONRPC("properties.noplayer.com");

            const result = await jsonrpc.getProperties();
            assert.deepStrictEqual(result, {
                "muted":     false,
                "volume":    51,
                "repeat":    "off",
                "shuffled":  false,
                "speed":     null,
                "time":      0,
                "totaltime": 0
            });
        });

        it("should get properties when other player active", async function () {
            const jsonrpc = new JSONRPC("properties.otherplayer.com");

            const result = await jsonrpc.getProperties();
            assert.deepStrictEqual(result, {
                "muted":     true,
                "volume":    0,
                "repeat":    "off",
                "shuffled":  false,
                "speed":     null,
                "time":      0,
                "totaltime": 0
            });
        });

        it("should get properties when video player active", async function () {
            const jsonrpc = new JSONRPC("properties.videoplayer.com");

            const result = await jsonrpc.getProperties();
            assert.deepStrictEqual(result, {
                "muted":     false,
                "volume":    100,
                "repeat":    "one",
                "shuffled":  true,
                "speed":     1,
                "time":      62,
                "totaltime": 3723
            });
        });
    });

    describe("onVolumeChanged()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onvolumechanged.com");
            jsonrpc.onVolumeChanged = done;
            jsonrpc.setMute(false);
        });
    });

    describe("onAVStart()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onavstart.com");
            jsonrpc.onAVStart = done;
            jsonrpc.open();
        });
    });

    describe("onPause()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onpause.com");
            jsonrpc.onPause = done;
            jsonrpc.playPause();
        });
    });

    describe("onPlay()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onplay.com");
            jsonrpc.onPlay = done;
            jsonrpc.playPause();
        });
    });

    describe("onPropertyChanged()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onpropertychanged.com");
            jsonrpc.onPropertyChanged = done;
            jsonrpc.playPause();
        });
    });

    describe("onResume()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onresume.com");
            jsonrpc.onResume = done;
            jsonrpc.playPause();
        });
    });

    describe("onSeek()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onseek.com");
            jsonrpc.onSeek = function (properties) {
                assert.deepStrictEqual(properties, {
                    "item":   "Video name.",
                    "player": {
                        "playerid": 1,
                        "speed":    2,
                        "time":     3723
                    }
                });
                done();
            };
            jsonrpc.seek(60);
        });
    });

    describe("onSpeedChanged()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onspeedchanged.com");
            jsonrpc.onSpeedChanged = done;
            jsonrpc.setSpeed(2);
        });
    });

    describe("onStop()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onstop.com");
            jsonrpc.onStop = done;
            jsonrpc.stop();
        });
    });

    describe("onQuit()", function () {
        it("should ignore event", function () {
            const jsonrpc = new JSONRPC("event.onquit.com");
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
