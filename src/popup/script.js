/**
 * @module popup/script
 */

import { JSONRPC } from "../core/jsonrpc.js";

/**
 * La liste des vitesses de lecture.
 *
 * @constant {Array.<number>}
 * @see speed
 */
const SPEEDS = [-32, -16, -8, -4, -2, 1, 2, 4, 8, 16, 32];

/**
 * L'indice de la vitesse de lecture ou <code>-1</code> si la lecture est en
 * pause ou <code>null</code> s'il n'y a aucune lecture en cours.
 *
 * @type {?number}
 * @see SPEEDS
 */
let speed  = null;

let interval = null;

let jsonrpc = null;

const onSeek = function ({ player }) {
    // Garder seulement les changements sur le lecteur de vidéo.
    if (1 !== player.playerid) {
        return;
    }

    const time = document.querySelector("#time");
    const max = parseInt(time.max, 10);
    time.valueAsNumber = Math.min(player.time, max);

    if (time.disabled) {
        time.parentElement.previousElementSibling.textContent = "";
        time.parentElement.nextElementSibling.textContent = "";
    } else if (3600 < max) {
        time.parentElement.previousElementSibling.textContent =
            Math.trunc(time.valueAsNumber / 3600) + ":" +
            (Math.trunc(time.valueAsNumber / 60) % 60).toString()
                                                      .padStart(2, "0") + ":" +
            (time.valueAsNumber % 60).toString().padStart(2, "0");
        time.parentElement.nextElementSibling.textContent =
            Math.trunc(max / 3600) + ":" +
            (Math.trunc(max / 60) % 60).toString().padStart(2, "0") + ":" +
            (max % 60).toString().padStart(2, "0");
    } else {
        time.parentElement.previousElementSibling.textContent =
            Math.trunc(time.valueAsNumber / 60) + ":" +
            (time.valueAsNumber % 60).toString().padStart(2, "0");
        time.parentElement.nextElementSibling.textContent =
            Math.trunc(max / 60) + ":" +
            (max % 60).toString().padStart(2, "0");
    }
};

const onStop = function () {
    speed = null;

    document.querySelector("#time").disabled = true;
    onSeek({ "player": { "playerid": 1, "time": 0 } });

    document.querySelector("#previous").disabled = true;
    document.querySelector("#rewind").disabled = true;
    document.querySelector("#stop").disabled = true;
    document.querySelector("#pause").style.display = "none";
    document.querySelector("#play").style.display = "inline";
    document.querySelector("#forward").disabled = true;
    document.querySelector("#next").disabled = true;

    for (const input of document.querySelectorAll(`[name="repeat"]`)) {
        input.disabled = true;
    }
    document.querySelector("#shuffle").disabled = true;
};

const onSpeedChanged = function ({ player }) {
    // Garder seulement les changements sur le lecteur de vidéo.
    if (1 !== player.playerid) {
        return;
    }

    speed = SPEEDS.indexOf(player.speed);

    document.querySelector("#time").disabled = false;

    document.querySelector("#previous").disabled = false;
    document.querySelector("#rewind").disabled = false;
    document.querySelector("#stop").disabled = false;
    if (5 === speed) {
        document.querySelector("#play").style.display = "none";
        document.querySelector("#pause").style.display = "inline";
    } else {
        document.querySelector("#pause").style.display = "none";
        document.querySelector("#play").style.display = "inline";
    }
    document.querySelector("#forward").disabled = false;
    document.querySelector("#next").disabled = false;

    for (const input of document.querySelectorAll(`[name="repeat"]`)) {
        input.disabled = false;
    }
    document.querySelector("#shuffle").disabled = false;
};

const onPropertyChanged = function ({ player, property }) {
    // Garder seulement les changements sur le lecteur de vidéo.
    if (1 !== player.playerid) {
        return;
    }

    if ("repeat" in property) {
        document.querySelector(`[name="repeat"][value="${property.repeat}"]`)
                                                                .checked = true;
    }
    if ("shuffled" in property) {
        document.querySelector("#shuffle").checked = property.shuffled;
    }
};

const onVolumeChanged = function (properties) {
    const mute = document.querySelector("#mute");
    mute.disabled = false;
    mute.checked = properties.muted;

    const volume = document.querySelector("#volume");
    volume.disabled = false;
    volume.valueAsNumber = properties.volume;
    if (properties.muted) {
        volume.classList.add("disabled");
    } else {
        volume.classList.remove("disabled");
    }
};

const notify = function (err) {
    const article = document.querySelector("article");
    if ("PebkacError" === err.name) {
        article.querySelector("h1").textContent = err.title;
    } else {
        article.querySelector("h1").textContent =
                         browser.i18n.getMessage("notifications_unknown_title");
    }
    article.querySelector("p").textContent = err.message;
    article.style.display = "block";
    document.querySelector("hr").style.display = "none";
};

const update = function () {
    return jsonrpc.getProperties().then(function (properties) {
        document.querySelector("#send").disabled = false;
        document.querySelector("#insert").disabled = false;
        document.querySelector("#add").disabled = false;
        document.querySelector("#paste").disabled = false;
        document.querySelector("#preferences").disabled = false;
        document.querySelector("#loading").style.display = "none";
        document.querySelector("#rate").style.display = "inline-block";

        if (null === properties.speed) {
            onStop();
        } else {
            onSpeedChanged({ "player": {
                "playerid": 1,
                "speed":    properties.speed
            } });
        }

        document.querySelector("#time").max = properties.totaltime.toString();
        onSeek({ "player": { "playerid": 1, "time": properties.time } });

        document.querySelector("#pause").disabled = 0 === properties.totaltime;
        document.querySelector("#play").disabled = false;

        onVolumeChanged(properties);

        onPropertyChanged({
            "player":   { "playerid": 1 },
            "property": { "repeat": properties.repeat }
        });
        onPropertyChanged({
            "player":   { "playerid": 1 },
            "property": { "shuffled": properties.shuffled }
        });
    }).catch(notify);
};

const cast = function (menuItemId) {
    // Récupérer l'URL dans la zone de saisie ou celle de l'onglet courant.
    let promise;
    if (document.querySelector("#paste").checked) {
        promise = Promise.resolve(document.querySelector("textarea").value);
    } else {
        const queryInfo = {
            "active":        true,
            "currentWindow": true
        };
        promise = browser.tabs.query(queryInfo).then(([{ url }]) => url);
    }

    promise.then(function (popupUrl) {
        return browser.runtime.sendMessage({ popupUrl, menuItemId });
    }).then(close);
};

const send = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#send").disabled) {
        return;
    }

    cast("send");
};

const insert = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#insert").disabled) {
        return;
    }

    cast("insert");
};

const add = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#add").disabled) {
        return;
    }

    cast("add");
};

const paste = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#paste").disabled) {
        return;
    }

    const input = document.querySelector("#paste");
    if (input.checked) {
        input.checked = false;
        document.querySelector("#preferences").disabled = false;
        document.querySelector("#rate").disabled = false;
    } else {
        input.checked = true;
        document.querySelector("#preferences").disabled = true;
        document.querySelector("#rate").disabled = true;
        document.querySelector("textarea").focus();
    }
};

const preferences = function () {
    browser.runtime.openOptionsPage().then(close);
};

const rate = function () {
    browser.tabs.create({
        "url": "https://addons.mozilla.org/addon/castkodi/reviews/"
    }).then(close);
};

const previous = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#previous").disabled) {
        return;
    }

    jsonrpc.previous().catch(notify);
};

const rewind = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#rewind").disabled) {
        return;
    }

    switch (speed) {
        case -1: speed = 4; break;
        case 0:  speed = 5; break;
        default: --speed;
    }
    jsonrpc.setSpeed(SPEEDS[speed]).catch(notify);
};

const stop = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#stop").disabled) {
        return;
    }

    speed = null;
    jsonrpc.stop().catch(notify);
};

const playPause = function () {
    if (null === speed) {
        speed = 5;
        jsonrpc.open().catch(notify);
    } else if (5 === speed) {
        // Annuler l'action (venant d'un raccourci clavier) si le bouton est
        // désactivé (car la connexion à Kodi a échouée).
        if (document.querySelector("#pause").disabled) {
            return;
        }

        speed = -1;
        jsonrpc.playPause().catch(notify);
    } else {
        speed = 5;
        jsonrpc.playPause().catch(notify);
    }
};

const forward = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#forward").disabled) {
        return;
    }

    switch (speed) {
        case -1: speed = 6; break;
        case 10: speed = 5; break;
        default: ++speed;
    }
    jsonrpc.setSpeed(SPEEDS[speed]).catch(notify);
};

const next = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#next").disabled) {
        return;
    }

    jsonrpc.next().catch(notify);
};

const setMute = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#mute").disabled) {
        return;
    }


    const input = document.querySelector("#mute");
    if (input.checked) {
        input.checked = false;
        document.querySelector("#volume").classList.remove("disabled");
    } else {
        input.checked = true;
        document.querySelector("#volume").classList.add("disabled");
    }
    jsonrpc.setMute(input.checked).catch(notify);
};

const setVolume = function (diff) {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#volume").disabled) {
        return;
    }

    const input = document.querySelector("#volume");

    document.querySelector("#mute").checked = false;
    input.classList.remove("disabled");

    if (Number.isInteger(diff)) {
        input.valueAsNumber += diff;
    }
    jsonrpc.setVolume(input.valueAsNumber).catch(notify);
};

const repeat = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector(`[name="repeat"]`).disabled) {
        return;
    }

    const [off, all, one] = document.querySelectorAll(`[name="repeat"]`);
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
    jsonrpc.setRepeat().catch(notify);
};

const shuffle = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#shuffle").disabled) {
        return;
    }

    const input = document.querySelector("#shuffle");
    input.checked = !input.checked;
    jsonrpc.setShuffle(input.checked).catch(notify);
};

const passing = function () {
    if (null === speed || -1 === speed) {
        return;
    }

    const time = document.querySelector("#time");
    onSeek({ "player": {
        "playerid": 1,
        "time":     time.valueAsNumber + SPEEDS[speed]
    } });
};

const move = function () {
    clearInterval(interval);
    const time = document.querySelector("#time");

    onSeek({ "player": {
        "playerid": 1,
        "time":     time.valueAsNumber
    } });
};

const seek = function () {
    interval = setInterval(passing, 1000);
    const time = document.querySelector("#time");
    jsonrpc.seek(time.valueAsNumber).catch(notify);
};


document.querySelector("#send").onclick = send;
document.querySelector("#insert").onclick = insert;
document.querySelector("#add").onclick = add;
document.querySelector("#paste + span").onclick = paste;
document.querySelector("#preferences").onclick = preferences;
document.querySelector("#rate").onclick = rate;

document.querySelector("#time").oninput = move;
document.querySelector("#time").onchange = seek;

document.querySelector("#previous").onclick = previous;
document.querySelector("#rewind").onclick = rewind;
document.querySelector("#stop").onclick = stop;
document.querySelector("#pause").onclick = playPause;
document.querySelector("#play").onclick = playPause;
document.querySelector("#forward").onclick = forward;
document.querySelector("#next").onclick = next;

document.querySelector(`#mute ~ span[data-i18n-title="mute"]`)
                                                             .onclick = setMute;
document.querySelector(`#mute ~ span[data-i18n-title="sound"]`)
                                                             .onclick = setMute;
document.querySelector("#volume").oninput = setVolume;

document.querySelector("#repeat-all").onclick = repeat;
document.querySelector("#repeat-one").onclick = repeat;
document.querySelector("#shuffle + span").onclick = shuffle;

document.querySelector("#configure").onclick = preferences;

// Insérer le code SVG des icônes dans la page pour pouvoir changer leur couleur
// avec la feuille de style.
for (const element of document.querySelectorAll("object")) {
    if ("loading" !== element.parentNode.id) {
        fetch(element.data).then(function (response) {
            return response.text();
        }).then(function (svg) {
            element.innerHTML = svg;
            element.removeAttribute("data");
        });
    }
}

window.focus();
window.onkeydown = function (event) {
    // Ignorer les entrées avec une touche de modification.
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
    }

    if ("TEXTAREA" === event.target.tagName && "Enter" === event.key) {
        send();
        event.preventDefault();
    }
};
window.onkeyup = function (event) {
    // Ignorer les entrées dans une zone de texte ou avec une touche de
    // modification.
    if ("TEXTAREA" === event.target.tagName || event.altKey || event.ctrlKey ||
            event.metaKey || event.shiftKey) {
        return;
    }

    switch (event.key) {
        case "p": case "P": send();         break;
        case "n": case "N": insert();       break;
        case "q": case "Q": add();          break;
        case "v": case "V": paste();        break;
        case "PageUp":      previous();     break;
        case "r": case "R": rewind();       break;
        case "x": case "X": stop();         break;
        case " ":           playPause();    break;
        case "f": case "F": forward();      break;
        case "PageDown":    next();         break;
        case "m": case "M": setMute();      break;
        case "-":           setVolume(-10); break;
        case "+": case "=": setVolume(10);  break;
        // Appliquer le traitement par défaut pour les autres entrées.
        default: return;
    }
    event.preventDefault();
};

interval = setInterval(passing, 1000);

browser.storage.local.get(["connection-host"]).then(function (config) {
    jsonrpc = new JSONRPC(config["connection-host"]);
    jsonrpc.onVolumeChanged   = onVolumeChanged;
    jsonrpc.onAVStart         = update;
    jsonrpc.onPause           = onSpeedChanged;
    jsonrpc.onPlay            = update;
    jsonrpc.onPropertyChanged = onPropertyChanged;
    jsonrpc.onResume          = onSpeedChanged;
    jsonrpc.onSeek            = onSeek;
    jsonrpc.onSpeedChanged    = onSpeedChanged;
    jsonrpc.onStop            = onStop;
    update();
});
