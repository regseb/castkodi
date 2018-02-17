"use strict";

require.config({
    "baseUrl": "../core"
});

define(["jsonrpc", "pebkac", "notify"],
       function (jsonrpc, PebkacError, notify) {

    const SPEEDS = [-32, -16, -8, -4, -2, 1, 2, 4, 8, 16, 32];

    let volume = null;
    let speed  = null;

    const paint = function () {
        if (null === volume) {
            document.getElementById("send").disabled = true;
            document.getElementById("add").disabled = true;
            document.getElementsByName("paste")[0].disabled = true;
            document.getElementById("preferences").disabled = false;
            document.getElementById("warning").disabled = false;
            document.getElementById("loading").style.display = "none";
            document.getElementById("love").style.display = "none";
            document.getElementById("warning").style.display = "inline";

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
        } else {
            document.getElementById("send").disabled = false;
            document.getElementById("add").disabled = false;
            document.getElementsByName("paste")[0].disabled = false;
            document.getElementById("preferences").disabled = false;
            document.getElementById("love").disabled = false;
            document.getElementById("loading").style.display = "none";
            document.getElementById("warning").style.display = "none";
            document.getElementById("love").style.display = "inline-block";

            document.getElementById("previous").disabled = null === speed;
            document.getElementById("rewind").disabled = null === speed;
            document.getElementById("stop").disabled = null === speed;
            document.getElementById("pause").disabled = null === speed;
            document.getElementById("play").disabled = false;
            if (5 === speed) {
                document.getElementById("play").style.display = "none";
                document.getElementById("pause").style.display = "inline";
            } else {
                document.getElementById("pause").style.display = "none";
                document.getElementById("play").style.display = "inline";
            }
            document.getElementById("forward").disabled = null === speed;
            document.getElementById("next").disabled = null === speed;

            document.getElementsByName("mute")[0].disabled = false;
            document.getElementById("sound").disabled = false;
            document.getElementById("volume").disabled = false;
            if (document.getElementsByName("mute")[0].checked) {
                document.getElementById("volume").value = 0;
            } else {
                document.getElementById("volume").value = volume;
            }
            for (const input of document.getElementsByName("repeat")) {
                input.disabled = null === speed;
            }
            document.getElementsByName("shuffle")[0].disabled = null === speed;
            document.getElementById("clear").disabled = null === speed;
        }
    };

    const send = function () {
        let input;
        if (document.getElementsByName("paste")[0].checked) {
            input = Promise.resolve(
                            document.getElementsByTagName("textarea")[0].value);
        } else {
            // Récupérer l'URL de l'onglet courant.
            const queryInfo = {
                "active":        true,
                "currentWindow": true
            };
            input = browser.tabs.query(queryInfo).then(([{ url }]) => url);
        }

        input.then(function (url) {
            browser.runtime.sendMessage({
                "popupUrl":   url,
                "menuItemId": "send_popup"
            }).then(close);
        });
    };

    const add = function () {
        let input;
        if (document.getElementsByName("paste")[0].checked) {
            input = Promise.resolve(
                            document.getElementsByTagName("textarea")[0].value);
        } else {
            // Récupérer l'URL de l'onglet courant.
            const queryInfo = {
                "active":        true,
                "currentWindow": true
            };
            input = browser.tabs.query(queryInfo).then(([{ url }]) => url);
        }

        input.then(function (url) {
            browser.runtime.sendMessage({
                "popupUrl":   url,
                "menuItemId": "add_popup"
            }).then(close);
        });
    };

    const paste = function () {
        const input = document.getElementsByName("paste")[0];
        if (input.checked) {
            input.checked = false;
            document.getElementById("preferences").disabled = false;
            document.getElementById("love").disabled = false;
        } else {
            input.checked = true;
            document.getElementById("preferences").disabled = true;
            document.getElementById("love").disabled = true;
            document.getElementsByTagName("textarea")[0].focus();
        }
    };

    const preferences = function () {
        browser.runtime.openOptionsPage().then(close);
    };

    const love = function () {
        browser.tabs.create({
            "url": "https://addons.mozilla.org/addon/castkodi/reviews/"
        }).then(close);
    };

    const warning = function () {
        jsonrpc.check().then(function () {
            paint();
            notify(new PebkacError("success"));
        }).catch(notify);
    };

    const previous = function () {
        jsonrpc.previous().then(paint).catch(notify);
    };

    const rewind = function () {
        switch (speed) {
            case -1: speed = 4; break;
            case 0:  speed = 5; break;
            default: --speed;
        }
        jsonrpc.setSpeed(SPEEDS[speed]).then(paint).catch(notify);
    };

    const stop = function () {
        jsonrpc.stop().then(function () {
            speed = null;
            paint();
        }).catch(notify);
    };

    const playPause = function () {
        if (5 === speed) {
            jsonrpc.playPause().then(paint).catch(notify);
            speed = -1;
        } else if (null !== volume) {
            if (null === speed) {
                jsonrpc.open().then(paint).catch(notify);
            } else {
                jsonrpc.playPause().then(paint).catch(notify);
            }
            speed = 5;
        }
    };

    const forward = function () {
        switch (speed) {
            case -1: speed = 6; break;
            case 10: speed = 5; break;
            default: ++speed;
        }
        jsonrpc.setSpeed(SPEEDS[speed]).then(paint).catch(notify);
    };

    const next = function () {
        jsonrpc.next().then(paint).catch(notify);
    };

    const muteSound = function () {
        if (document.getElementsByName("mute")[0].checked) {
            document.getElementsByName("mute")[0].checked = false;
            jsonrpc.setMute(false).then(paint).catch(notify);
        } else {
            document.getElementsByName("mute")[0].checked = true;
            jsonrpc.setMute(true).then(paint).catch(notify);
        }
    };

    const setVolume = function () {
        volume = parseInt(document.getElementById("volume").value, 10);

        if (document.getElementsByName("mute")[0].checked) {
            muteSound();
        }
        jsonrpc.setVolume(volume).then(paint).catch(notify);
    };

    const subVolume = function () {
        volume = parseInt(document.getElementById("volume").value, 10);
        volume = Math.max(volume - 10, 0);
        document.getElementById("volume").value = volume;
        document.getElementById("volume").dispatchEvent(new Event("input", {
            "bubbles":    true,
            "cancelable": true
        }));
    };

    const addVolume = function () {
        volume = parseInt(document.getElementById("volume").value, 10);
        volume = Math.min(volume + 10, 100);
        document.getElementById("volume").value = volume;
        document.getElementById("volume").dispatchEvent(new Event("input", {
            "bubbles":    true,
            "cancelable": true
        }));
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
        jsonrpc.setRepeat().then(paint).catch(notify);
    };

    const shuffle = function () {
        const input = document.getElementsByName("shuffle")[0];
        input.checked = !input.checked;
        jsonrpc.setShuffle(input.checked).then(paint).catch(notify);
    };

    const clear = function () {
        jsonrpc.clear().then(paint).catch(notify);
    };

    jsonrpc.getProperties().then(function (properties) {
        document.getElementsByName("mute")[0].checked = properties.muted;
        volume = properties.volume;
        speed = null === properties.speed ? null
                                          : SPEEDS.indexOf(properties.speed);
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
    document.getElementById("pause").addEventListener("click", playPause);
    document.getElementById("play").addEventListener("click", playPause);
    document.getElementById("forward").addEventListener("click", forward);
    document.getElementById("next").addEventListener("click", next);

    document.getElementById("mute").addEventListener("click", muteSound);
    document.getElementById("sound").addEventListener("click", muteSound);
    document.getElementById("volume").addEventListener("input", setVolume);

    document.getElementById("repeat-all").addEventListener("click", repeat);
    document.getElementById("repeat-one").addEventListener("click", repeat);
    document.getElementById("shuffle").addEventListener("click", shuffle);
    document.getElementById("clear").addEventListener("click", clear);

    document.getElementById("send").addEventListener("click", send);
    document.getElementById("add").addEventListener("click", add);
    document.getElementById("paste").addEventListener("click", paste);

    document.getElementById("preferences").addEventListener("click",
                                                            preferences);
    document.getElementById("love").addEventListener("click", love);
    document.getElementById("warning").addEventListener("click", warning);

    for (const element of document.getElementsByTagName("object")) {
        if ("loading" !== element.parentNode.id) {
            fetch(element.getAttribute("data")).then(function (response) {
                return response.text();
            }).then(function (svg) {
                element.innerHTML = svg;
                element.removeAttribute("data");
            });
        }
    }

    window.focus();
    window.onkeyup = function (event) {
        // Ignorer les entrées dans une zone de texte ou avec une touche de
        // modification.
        if ("TEXTAREA" === event.target.tagName || event.altKey ||
                event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        switch (event.key) {
            case "p": case "P": send();      break;
            case "q": case "Q": add();       break;
            case "v": case "V": paste();     break;
            case "PageDown":    previous();  break;
            case "r": case "R": rewind();    break;
            case "x": case "X": stop();      break;
            case " ":           playPause(); break;
            case "f": case "F": forward();   break;
            case "PageUp":      next();      break;
            case "m": case "M": muteSound(); break;
            case "-":           subVolume(); break;
            case "+": case "=": addVolume(); break;
            // Appliquer le traitement par défaut pour les autres entrées.
            default: return;
        }
        event.preventDefault();
    };

    // Afficher les textes dans la langue courante.
    for (const element of document.querySelectorAll("[data-i18n-title]")) {
        const key = "popup_" + element.getAttribute("data-i18n-title") +
                    "_title";
        element.setAttribute("title", browser.i18n.getMessage(key));
    }
});
