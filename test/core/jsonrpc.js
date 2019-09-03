import assert      from "assert";
import { JSONRPC } from "../../src/core/jsonrpc.js";

describe("jsonrpc", function () {
    describe("#check()", function () {
        it("should send request", function () {
            // Vérifier que la méthode check() retourne une promesse tenue.
            return JSONRPC.check("locahost");
        });

        it("should return error when no host", function () {
            const expected = "unconfigured";
            return JSONRPC.check("").then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            });
        });

        it("should return error when host is invalid", function () {
            const expected = "badHost";
            return JSONRPC.check("bad host").then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            });
        });

        it("should return error when IP is invalid", function () {
            const expected = "badHost";
            return JSONRPC.check("192.168").then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            });
        });

        it("should return error when receive 400", function () {
            const expected = "notFound";
            return JSONRPC.check("notfound.com").then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "PebkacError");
                assert.strictEqual(err.type, expected);
            });
        });

        it("should return ierror when receive Kodi's error", function () {
            return JSONRPC.check("error.com").then(function () {
                assert.fail();
            }).catch(function (err) {
                assert.strictEqual(err.name, "Error");
                assert.strictEqual(err.message, "Error message!");
            });
        });
    });

    describe("#close()", function () {
        it("should close WebSocket", function () {
            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.version().then(function () {
                jsonrpc.close();
            });
        });

        it("should do nothing with WebSocket doesn't open", function () {
            const jsonrpc = new JSONRPC("localhost");
            jsonrpc.close();
        });
    });

    describe("#add()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const file = "Le fichier";
            return jsonrpc.add(file).then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Playlist.Add",
                    "params": { "playlistid": 1, "item": { file } }
                });
            });
        });
    });

    describe("#send()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const file = "Le fichier";
            return jsonrpc.send(file).then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.Open",
                    "params": {  "item": { "playlistid": 1 } }
                });
            });
        });
    });

    describe("#insert()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const file = "Le fichier";
            return jsonrpc.insert(file).then(function (result) {
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
    });

    describe("#previous()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.previous().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.GoTo",
                    "params": { "playerid": 1, "to": "previous" }
                });
            });
        });
    });

    describe("#stop()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.stop().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.Stop",
                    "params": { "playerid": 1 }
                });
            });
        });
    });

    describe("#open()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.open().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.Open",
                    "params": { "item": { "playlistid": 1 } }
                });
            });
        });
    });

    describe("#playPause()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.playPause().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.PlayPause",
                    "params": { "playerid": 1 }
                });
            });
        });
    });

    describe("#seek()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.seek(100).then(function (result) {
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
    });

    describe("#next()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.next().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.GoTo",
                    "params": { "playerid": 1, "to": "next" }
                });
            });
        });
    });

    describe("#setSpeeed()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const speed = 32;
            return jsonrpc.setSpeed(speed).then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.SetSpeed",
                    "params": { "playerid": 1, speed }
                });
            });
        });
    });

    describe("#setMute()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const mute = true;
            return jsonrpc.setMute(mute).then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Application.SetMute",
                    "params": { mute }
                });
            });
        });
    });

    describe("#setVolume()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const volume = 51;
            return jsonrpc.setVolume(volume).then(function (result) {
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
    });

    describe("#setRepeat()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.setRepeat().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Player.SetRepeat",
                    "params": { "playerid": 1, "repeat": "cycle" }
                });
            });
        });
    });

    describe("#setShuffle()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            const shuffle = true;
            return jsonrpc.setShuffle(shuffle).then(function (result) {
                assert.deepStrictEqual(result, {
                    "method":  "Player.SetShuffle",
                    "params":  { "playerid": 1, shuffle }
                });
            });
        });
    });

    describe("#clear()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.clear().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Playlist.Clear",
                    "params": { "playlistid": 1 }
                });
            });
        });
    });

    describe("#contextMenu()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.contextMenu().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.ContextMenu",
                    "params": {}
                });
            });
        });
    });

    describe("#up()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.up().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Up",
                    "params": {}
                });
            });
        });
    });

    describe("#info()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.info().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Info",
                    "params": {}
                });
            });
        });
    });

    describe("#left()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.left().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Left",
                    "params": {}
                });
            });
        });
    });

    describe("#select()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.select().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Select",
                    "params": {}
                });
            });
        });
    });

    describe("#right()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.right().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Right",
                    "params": {}
                });
            });
        });
    });

    describe("#back()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.back().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Back",
                    "params": {}
                });
            });
        });
    });

    describe("#down()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.down().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.Down",
                    "params": {}
                });
            });
        });
    });

    describe("#showOSD()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.showOSD().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "Input.ShowOSD",
                    "params": {}
                });
            });
        });
    });

    describe("#version()", function () {
        it("should send request", function () {
            const jsonrpc = new JSONRPC("localhost");
            return jsonrpc.version().then(function (result) {
                assert.deepStrictEqual(result, {
                    "method": "JSONRPC.Version",
                    "params": {}
                });
            });
        });
    });

    describe("#getProperties()", function () {
        it("should get properties when no player active", function () {
            const jsonrpc = new JSONRPC("properties.noplayer.com");
            return jsonrpc.getProperties().then(function (result) {
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
        });

        it("should get properties when other player active", function () {
            const jsonrpc = new JSONRPC("properties.otherplayer.com");
            return jsonrpc.getProperties().then(function (result) {
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
        });

        it("should get properties when video player active", function () {
            const jsonrpc = new JSONRPC("properties.videoplayer.com");
            return jsonrpc.getProperties().then(function (result) {
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
    });

    describe("#onVolumeChanged()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onvolumechanged.com");
            jsonrpc.onVolumeChanged = done;
            jsonrpc.setMute(false);
        });
    });

    describe("#onAVStart()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onavstart.com");
            jsonrpc.onAVStart = done;
            jsonrpc.open();
        });
    });

    describe("#onPause()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onpause.com");
            jsonrpc.onPause = done;
            jsonrpc.playPause();
        });
    });

    describe("#onPlay()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onplay.com");
            jsonrpc.onPlay = done;
            jsonrpc.playPause();
        });
    });

    describe("#onPropertyChanged()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onpropertychanged.com");
            jsonrpc.onPropertyChanged = done;
            jsonrpc.playPause();
        });
    });

    describe("#onResume()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onresume.com");
            jsonrpc.onResume = done;
            jsonrpc.playPause();
        });
    });

    describe("#onSeek()", function () {
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

    describe("#onSpeedChanged()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onspeedchanged.com");
            jsonrpc.onSpeedChanged = done;
            jsonrpc.setSpeed(2);
        });
    });

    describe("#onStop()", function () {
        it("should receive event", function (done) {
            const jsonrpc = new JSONRPC("event.onstop.com");
            jsonrpc.onStop = done;
            jsonrpc.stop();
        });
    });

    describe("#onQuit()", function () {
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
