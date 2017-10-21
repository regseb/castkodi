"use strict";

require.config({
    "baseUrl": "../core"
});

define(["scrapers", "jsonrpc", "pebkac", "notify"],
       function (scrapers, jsonrpc, PebkacError, notify) {

    const SPEEDS = [-32, -16, -8, -4, -2, 1, 2, 4, 8, 16, 32];

    let volume = null;
    let playerid = null;
    let speed = null;

    const paint = function () {
        if (null === volume) {
            document.getElementById("previous").disabled = true;
            document.getElementById("rewind").disabled = true;
            document.getElementById("stop").disabled = true;
            document.getElementById("pause").disabled = true;
            document.getElementById("play").disabled = true;
            document.getElementById("forward").disabled = true;
            document.getElementById("next").disabled = true;
            document.getElementsByName("mute")[0].disabled = true;
            document.getElementById("sound").disabled = true;
            document.getElementById("volume").disabled = true;
            for (const input of document.getElementsByName("repeat")) {
                input.disabled = true;
            }
            document.getElementsByName("shuffle")[0].disabled = true;
            document.getElementById("clear").disabled = true;
            document.getElementById("send").disabled = true;
            document.getElementById("add").disabled = true;
            document.getElementById("preferences").disabled = false;
            document.getElementById("check").disabled = false;
            document.getElementById("warning").disabled = false;

            document.getElementById("check").style.display = "none";
            document.getElementById("warning").style.display = "inline";
        } else {
            document.getElementById("previous").disabled = null === playerid;
            document.getElementById("rewind").disabled = null === playerid;
            document.getElementById("stop").disabled = null === playerid;
            document.getElementById("pause").disabled = null === playerid;
            document.getElementById("play").disabled = null === playerid;
            document.getElementById("forward").disabled = null === playerid;
            document.getElementById("next").disabled = null === playerid;
            document.getElementsByName("mute")[0].disabled = false;
            document.getElementById("sound").disabled = false;
            document.getElementById("volume").disabled = false;
            if (document.getElementsByName("mute")[0].checked) {
                document.getElementById("volume").value = 0;
            } else {
                document.getElementById("volume").value = volume;
            }
            for (const input of document.getElementsByName("repeat")) {
                input.disabled = null === playerid;
            }
            document.getElementsByName("shuffle")[0].disabled =
                                                              null === playerid;
            document.getElementById("clear").disabled = null === playerid;
            document.getElementById("send").disabled = false;
            document.getElementById("add").disabled = false;
            document.getElementById("preferences").disabled = false;
            document.getElementById("check").disabled = false;
            document.getElementById("warning").disabled = false;

            document.getElementById("warning").style.display = "none";
            document.getElementById("check").style.display = "inline";

            if (5 === speed) {
                document.getElementById("play").style.display = "none";
                document.getElementById("pause").style.display = "inline";
            } else {
                document.getElementById("pause").style.display = "none";
                document.getElementById("play").style.display = "inline";
            }
        }
    };

    const previous = function () {
        jsonrpc.previous(playerid).then(paint).catch(notify);
    };

    const rewind = function () {
        switch (speed) {
            case -1: speed = 4; break;
            case 0:  speed = 5; break;
            default: --speed;
        }
        jsonrpc.setSpeed(playerid, SPEEDS[speed]).then(paint).catch(notify);
    };

    const stop = function () {
        jsonrpc.stop(playerid).then(function () {
            playerid = null;
            paint();
        }).catch(notify);
    };

    const pause = function () {
        speed = -1;
        jsonrpc.playPause(playerid).then(paint).catch(notify);
    };

    const play = function () {
        speed = 5;
        jsonrpc.playPause(playerid).then(paint).catch(notify);
    };

    const forward = function () {
        switch (speed) {
            case -1: speed = 6; break;
            case 10: speed = 5; break;
            default: ++speed;
        }
        jsonrpc.setSpeed(playerid, SPEEDS[speed]).then(paint).catch(notify);
    };

    const next = function () {
        jsonrpc.next(playerid).then(paint).catch(notify);
    };

    const mute = function () {
        document.getElementsByName("mute")[0].checked = true;
        jsonrpc.setMute(true).then(paint).catch(notify);
    };

    const sound = function () {
        document.getElementsByName("mute")[0].checked = false;
        jsonrpc.setMute(false).then(paint).catch(notify);
    };

    const setVolume = function () {
        volume = parseInt(document.getElementById("volume").value, 10);

        if (document.getElementsByName("mute")[0].checked) {
            sound();
        }
        jsonrpc.setVolume(volume).then(paint).catch(notify);
    };

    const repeat = function () {
        const off = document.getElementsByName("repeat")[0];
        const all = document.getElementsByName("repeat")[1];
        const one = document.getElementsByName("repeat")[2];
        if (off.checked) {
            off.checked = false;
            all.checked = true;
        } else if (all.checked) {
            all.checked = false;
            one.checked = true;
        } else {
            one.checked = false;
            off.checked = true;
        }
        jsonrpc.setRepeat(playerid).then(paint).catch(notify);
    };

    const shuffle = function () {
        const input = document.getElementsByName("shuffle")[0];
        input.checked = !input.checked;
        jsonrpc.setShuffle(playerid, input.checked).then(paint).catch(notify);
    };

    const clear = function () {
        jsonrpc.clear(playerid).then(paint).catch(notify);
    };

    const send = function () {
        // Récupérer l'URL de l'onglet courant.
        const queryInfo = {
            "active":        true,
            "currentWindow": true
        };
        browser.tabs.query(queryInfo).then(function ([{ url }]) {
            scrapers.extract(new URL(url)).then(
                                               function ({ playlistid, file }) {
                return jsonrpc.send(playlistid, file);
            }).then(function () {
                return browser.storage.local.get(["general-history"]);
            }).then(function (results) {
                if (results["general-history"]) {
                    return browser.history.addUrl({ url });
                }
                return Promise.resolve();
            }).then(function () {
                window.close();
            }).catch(notify);
        });
    };

    const add = function () {
        // Récupérer l'URL de l'onglet courant.
        const queryInfo = {
            "active":        true,
            "currentWindow": true
        };
        browser.tabs.query(queryInfo).then(function ([{ url }]) {
            scrapers.extract(new URL(url)).then(
                                               function ({ playlistid, file }) {
                return jsonrpc.add(playlistid, file);
            }).then(function () {
                return browser.storage.local.get(["general-history"]);
            }).then(function (results) {
                if (results["general-history"]) {
                    return browser.history.addUrl({ url });
                }
                return Promise.resolve();
            }).then(function () {
                window.close();
            }).catch(notify);
        });
    };

    const preferences = function () {
        browser.runtime.openOptionsPage().then(function () {
            window.close();
        });
    };

    const check = function () {
        jsonrpc.check().then(function () {
            paint();
            notify(new PebkacError("success"));
        }).catch(notify);
    };

    jsonrpc.getProperties().then(function (properties) {
        document.getElementsByName("mute")[0].checked = properties.muted;
        volume = properties.volume;
        playerid = properties.playerid;
        speed = SPEEDS.indexOf(properties.speed);
        if ("off" === properties.repeat) {
            document.getElementsByName("repeat")[0].checked = true;
        } else if ("all" === properties.repeat) {
            document.getElementsByName("repeat")[1].checked = true;
        } else {
            document.getElementsByName("repeat")[2].checked = true;
        }
        document.getElementsByName("shuffle")[0].checked = properties.shuffled;
        paint();
    }).catch(paint);

    document.getElementById("previous").addEventListener("click", previous);
    document.getElementById("rewind").addEventListener("click", rewind);
    document.getElementById("stop").addEventListener("click", stop);
    document.getElementById("pause").addEventListener("click", pause);
    document.getElementById("play").addEventListener("click", play);
    document.getElementById("forward").addEventListener("click", forward);
    document.getElementById("next").addEventListener("click", next);

    document.getElementById("mute").addEventListener("click", sound);
    document.getElementById("sound").addEventListener("click", mute);
    document.getElementById("volume").addEventListener("input", setVolume);

    document.getElementById("repeat-all").addEventListener("click", repeat);
    document.getElementById("repeat-one").addEventListener("click", repeat);
    document.getElementById("shuffle").addEventListener("click", shuffle);
    document.getElementById("clear").addEventListener("click", clear);

    document.getElementById("send").addEventListener("click", send);
    document.getElementById("add").addEventListener("click", add);

    document.getElementById("preferences").addEventListener("click",
                                                            preferences);
    document.getElementById("check").addEventListener("click", check);
    document.getElementById("warning").addEventListener("click", check);
});
