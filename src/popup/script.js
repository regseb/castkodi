/**
 * @module popup/script
 */

import * as jsonrpc    from "../core/jsonrpc.js";
import { notify }      from "../core/notify.js";
import { PebkacError } from "../core/pebkac.js";
import { SCRAPERS }    from "../core/scrapers.js";

/**
 * La liste des vitesses de lecture.
 *
 * @constant {Array.<number>} SPEEDS
 * @see speed
 */
const SPEEDS = [-32, -16, -8, -4, -2, 1, 2, 4, 8, 16, 32];

let volume = null;
let speed  = null;

const paint = function () {
    if (null === volume) {
        document.getElementById("send").disabled = true;
        document.getElementById("insert").disabled = true;
        document.getElementById("add").disabled = true;
        document.getElementsByName("paste")[0].disabled = true;
        document.getElementById("preferences").disabled = false;
        document.getElementById("loading").style.display = "none";
        document.getElementById("love").style.display = "none";
        document.getElementById("error").style.display = "inline";

        document.getElementById("previous").disabled = true;
        document.getElementById("rewind").disabled = true;
        document.getElementById("stop").disabled = true;
        document.getElementById("pause").disabled = true;
        document.getElementById("play").disabled = true;
        document.getElementById("pause").style.display = "none";
        document.getElementById("play").style.display = "inline";
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
        document.getElementById("insert").disabled = false;
        document.getElementById("add").disabled = false;
        document.getElementsByName("paste")[0].disabled = false;
        document.getElementById("preferences").disabled = false;
        document.getElementById("loading").style.display = "none";
        document.getElementById("error").style.display = "none";
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

const cast = function ({ "target": { "id": action } }) {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById(action).disabled) {
        return;
    }

    // Récupérer l'URL dans la zone de saisie ou celle de l'onglet courant.
    let promise;
    if (document.getElementsByName("paste")[0].checked) {
        promise = Promise.resolve(
                            document.getElementsByTagName("textarea")[0].value);
    } else {
        const queryInfo = {
            "active":        true,
            "currentWindow": true
        };
        promise = browser.tabs.query(queryInfo).then(([{ url }]) => url);
    }

    promise.then(function (popupUrl) {
        return browser.runtime.sendMessage({
            "popupUrl":   popupUrl,
            "menuItemId": action
        });
    }).then(close);
};

const paste = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementsByName("paste")[0].disabled) {
        return;
    }

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

const error = function () {
    jsonrpc.check().then(function () {
        paint();
        notify(new PebkacError("success"));
    }).catch(notify);
};

const previous = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById("previous").disabled) {
        return;
    }

    jsonrpc.previous().catch(notify);
};

const rewind = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById("rewind").disabled) {
        return;
    }

    switch (speed) {
        case -1: speed = 4; break;
        case 0:  speed = 5; break;
        default: --speed;
    }
    jsonrpc.setSpeed(SPEEDS[speed]).then(paint).catch(notify);
};

const stop = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById("stop").disabled) {
        return;
    }

    jsonrpc.stop().then(function () {
        speed = null;
        paint();
    }).catch(notify);
};

const playPause = function () {
    // Annuler l'action si le bouton est désactivé.
    if (null === volume) {
        return;
    }

    if (null === speed) {
        speed = 5;
        jsonrpc.open().then(paint).catch(notify);
    } else if (5 === speed) {
        speed = -1;
        jsonrpc.playPause().then(paint).catch(notify);
    } else {
        speed = 5;
        jsonrpc.playPause().then(paint).catch(notify);
    }
};

const forward = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById("forward").disabled) {
        return;
    }

    switch (speed) {
        case -1: speed = 6; break;
        case 10: speed = 5; break;
        default: ++speed;
    }
    jsonrpc.setSpeed(SPEEDS[speed]).then(paint).catch(notify);
};

const next = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById("next").disabled) {
        return;
    }

    jsonrpc.next().catch(notify);
};

const muteSound = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementsByName("mute")[0].disabled) {
        return;
    }

    const input = document.getElementsByName("mute")[0];
    input.checked = !input.checked;
    jsonrpc.setMute(input.checked).then(paint).catch(notify);
};

const setVolume = function () {
    if (document.getElementById("volume").disabled) {
        return;
    }

    volume = parseInt(document.getElementById("volume").value, 10);

    if (document.getElementsByName("mute")[0].checked) {
        muteSound();
    }
    jsonrpc.setVolume(volume).then(paint).catch(notify);
};

const subVolume = function () {
    // Annuler l'action si le bouton de potentiel est désactivé.
    if (document.getElementById("volume").disabled) {
        return;
    }

    const input = document.getElementById("volume");
    volume = Math.max(parseInt(input.value, 10) - 10, 0);
    input.value = volume;
    input.dispatchEvent(new Event("input", {
        "bubbles":    true,
        "cancelable": true
    }));
};

const addVolume = function () {
    // Annuler l'action si le bouton de potentiel est désactivé.
    if (document.getElementById("volume").disabled) {
        return;
    }

    const input = document.getElementById("volume");
    volume = Math.min(parseInt(input.value, 10) + 10, 100);
    input.value = volume;
    input.dispatchEvent(new Event("input", {
        "bubbles":    true,
        "cancelable": true
    }));
};

const repeat = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementsByName("repeat")[0].disabled) {
        return;
    }

    const [off, all, one] = document.getElementsByName("repeat");
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
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementsByName("shuffle")[0].disabled) {
        return;
    }

    const input = document.getElementsByName("shuffle")[0];
    input.checked = !input.checked;
    jsonrpc.setShuffle(input.checked).then(paint).catch(notify);
};

const clear = function () {
    // Annuler l'action si le bouton est désactivé.
    if (document.getElementById("clear").disabled) {
        return;
    }

    jsonrpc.clear().catch(notify);
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

document.getElementById("send").addEventListener("click", cast);
document.getElementById("insert").addEventListener("click", cast);
document.getElementById("add").addEventListener("click", cast);
document.getElementById("paste").addEventListener("click", paste);
document.getElementById("preferences").addEventListener("click", preferences);
document.getElementById("love").addEventListener("click", love);
document.getElementById("error").addEventListener("click", error);

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

// Insérer le code SVG des icônes dans la page pour pouvoir changer leur
// couleur avec la feuille de style.
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
    if ("TEXTAREA" === event.target.tagName || event.altKey || event.ctrlKey ||
            event.metaKey || event.shiftKey) {
        return;
    }
    switch (event.key) {
        case "p": case "P": cast({ "target": { "id": "send"   } }); break;
        case "n": case "N": cast({ "target": { "id": "insert" } }); break;
        case "q": case "Q": cast({ "target": { "id": "add"    } }); break;
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
    const key = `popup_${element.getAttribute("data-i18n-title")}_title`;
    element.setAttribute("title", browser.i18n.getMessage(key));
}
