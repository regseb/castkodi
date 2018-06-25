import assert       from "assert";
import * as jsonrpc from "../../src/core/jsonrpc.js";

describe("jsonrpc", function () {
    describe("#check()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.check().then(function (result) {
                assert.strictEqual(result.input,
                                   "http://localhost:8080/jsonrpc");
                assert.deepStrictEqual(result.init, {
                    "method":  "POST",
                    "headers": { "Content-Type": "application/json" },
                    "body":    JSON.stringify({
                        "jsonrpc": "2.0",
                        "id":      "1",
                        "method":  "JSONRPC.Version",
                        "params":  {}
                    })
                });

                browser.storage.local.clear();
            });
        });

        it("should send request with authorization", function () {
            browser.storage.local.set({
                "connection-host":     "localhost",
                "connection-port":     "8080",
                "connection-username": "user",
                "connection-password": "pass"
            });

            return jsonrpc.check().then(function (result) {
                assert.strictEqual(result.input,
                                   "http://localhost:8080/jsonrpc");
                assert.deepStrictEqual(result.init, {
                    "method":  "POST",
                    "headers": {
                        "Content-Type":  "application/json",
                        "Authorization": "Basic " + btoa("user:pass")
                    },
                    "body":    JSON.stringify({
                        "jsonrpc": "2.0",
                        "id":      "1",
                        "method":  "JSONRPC.Version",
                        "params":  {}
                    })
                });

                browser.storage.local.clear();
            });
        });

        it("should return error when no host", function () {
            browser.storage.local.set({ "connection-port": "8080" });

            const expected = "unconfigured";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return error when no port", function () {
            browser.storage.local.set({ "connection-host": "localhost" });

            const expected = "unconfigured";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return error when receive 400", function () {
            browser.storage.local.set({
                "connection-host": "localhost.status.notFound",
                "connection-port": "8080"
            });

            const expected = "notFound";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return error when receive 401", function () {
            browser.storage.local.set({
                "connection-host": "localhost.status.unauthorized",
                "connection-port": "8080"
            });

            const expected = "unauthorized";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return error when URL is invalid", function () {
            browser.storage.local.set({
                "connection-host": "localhost.statusText.badHost",
                "connection-port": "8080"
            });

            const expected = "badHost";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return error when Kodi is inaccessible", function () {
            browser.storage.local.set({
                "connection-host": "localhost.statusText.notFound",
                "connection-port": "8080"
            });

            const expected = "notFound";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));

                browser.storage.local.clear();
            });
        });

        it("should return error when Kodi returns error", function () {
            browser.storage.local.set({
                "connection-host": "localhost.response.error",
                "connection-port": "8080"
            });

            const expected = "foo";
            return jsonrpc.check().then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "Error");
                assert.ok(error.message, expected);

                browser.storage.local.clear();
            });
        });
    });

    describe("#add()", function () {
        it("should send request", function () {
            browser.storage.local.set({ "connection-host": "localhost" });
            browser.storage.local.set({ "connection-port": "8080" });

            const file = "Le fichier";
            return jsonrpc.add(file).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Playlist.Add",
                    "params":  { "playlistid": 1, "item": { file } }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#send()", function () {
        it("should send request", function () {
            browser.storage.local.set({ "connection-host": "localhost" });
            browser.storage.local.set({ "connection-port": "8080" });

            const file = "Le fichier";
            return jsonrpc.send(file).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.Open",
                    "params":  {  "item": { "playlistid": 1 } }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#insert()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            const file = "Le fichier";
            return jsonrpc.insert(file).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Playlist.Insert",
                    "params":  {
                        "playlistid": 1,
                        "position":   null,
                        "item":       { file }
                    }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#previous()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.previous().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.GoTo",
                    "params":  { "playerid": 1, "to": "previous" }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#stop()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.stop().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.Stop",
                    "params":  { "playerid": 1 }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#open()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.open().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.Open",
                    "params":  { "item": { "playlistid": 1 } }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#playPause()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.playPause().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.PlayPause",
                    "params":  { "playerid": 1 }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#next()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.next().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.GoTo",
                    "params":  { "playerid": 1, "to": "next" }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#setSpeeed()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            const speed = 32;
            return jsonrpc.setSpeed(speed).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.SetSpeed",
                    "params":  { "playerid": 1, speed }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#setMute()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            const mute = true;
            return jsonrpc.setMute(mute).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Application.SetMute",
                    "params":  { mute }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#setVolume()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            const volume = 51;
            return jsonrpc.setVolume(volume).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Application.SetVolume",
                    "params":  { volume }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#setRepeat()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.setRepeat().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.SetRepeat",
                    "params":  { "playerid": 1, "repeat": "cycle" }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#setShuffle()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            const shuffle = true;
            return jsonrpc.setShuffle(shuffle).then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Player.SetShuffle",
                    "params":  { "playerid": 1, shuffle }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#clear()", function () {
        it("should send request", function () {
            browser.storage.local.set({
                "connection-host": "localhost",
                "connection-port": "8080"
            });

            return jsonrpc.clear().then(function (result) {
                assert.strictEqual(result.init.body, JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  "Playlist.Clear",
                    "params":  { "playlistid": 1 }
                }));

                browser.storage.local.clear();
            });
        });
    });

    describe("#getProperties()", function () {
        it("should get properties when no player active", function () {
            browser.storage.local.set({
                "connection-host": "localhost.response.properties.noPlayer",
                "connection-port": "8080"
            });

            return jsonrpc.getProperties().then(function (result) {
                assert.deepStrictEqual(result, {
                    "muted":    false,
                    "volume":   51,
                    "speed":    null,
                    "repeat":   "off",
                    "shuffled": false
                });

                browser.storage.local.clear();
            });
        });

        it("should get properties when other player active", function () {
            browser.storage.local.set({
                "connection-host": "localhost.response.properties.otherPlayer",
                "connection-port": "8080"
            });

            return jsonrpc.getProperties().then(function (result) {
                assert.deepStrictEqual(result, {
                    "muted":    true,
                    "volume":   0,
                    "speed":    null,
                    "repeat":   "off",
                    "shuffled": false
                });

                browser.storage.local.clear();
            });
        });

        it("should get properties when video player active", function () {
            browser.storage.local.set({
                "connection-host": "localhost.response.properties.videoPlayer",
                "connection-port": "8080"
            });

            return jsonrpc.getProperties().then(function (result) {
                assert.deepStrictEqual(result, {
                    "muted":    false,
                    "volume":   100,
                    "speed":    1,
                    "repeat":   "one",
                    "shuffled": true
                });

                browser.storage.local.clear();
            });
        });
    });
});
