/**
 * @module
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

/**
 * L'identifiant de l'intervalle faisant avancer la barre de progression.
 *
 * @type {?number}
 */
let interval = null;

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {?object}
 */
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
        time.previousElementSibling.textContent = "";
        time.nextElementSibling.textContent = "";
    } else if (3600 < max) {
        time.previousElementSibling.textContent =
            Math.trunc(time.valueAsNumber / 3600) + ":" +
            (Math.trunc(time.valueAsNumber / 60) % 60).toString()
                                                      .padStart(2, "0") + ":" +
            (time.valueAsNumber % 60).toString().padStart(2, "0");
        time.nextElementSibling.textContent =
            Math.trunc(max / 3600) + ":" +
            (Math.trunc(max / 60) % 60).toString().padStart(2, "0") + ":" +
            (max % 60).toString().padStart(2, "0");
    } else {
        time.previousElementSibling.textContent =
            Math.trunc(time.valueAsNumber / 60) + ":" +
            (time.valueAsNumber % 60).toString().padStart(2, "0");
        time.nextElementSibling.textContent =
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
    document.querySelector("#shuffle input").disabled = true;
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
    document.querySelector("#shuffle input").disabled = false;
};

const onPropertyChanged = function ({ player, property }) {
    // Garder seulement les changements sur le lecteur de vidéo.
    if (1 !== player.playerid) {
        return;
    }

    if ("repeat" in property) {
        document.querySelector(`[name="repeat"][value="${property.repeat}"]`)
                                                                .checked = true;
        document.querySelector("#repeat-off").style.display = "none";
        document.querySelector("#repeat-all").style.display = "none";
        document.querySelector("#repeat-one").style.display = "none";
        document.querySelector(`#repeat-${property.repeat}`).style.display =
                                                                 "inline-block";
    }
    if ("shuffled" in property) {
        document.querySelector("#shuffle input").checked = property.shuffled;
    }
};

const onVolumeChanged = function (properties) {
    const mute = document.querySelector("#mute input");
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
    document.querySelector("#cast").style.visibility = "hidden";
    document.querySelector("#playing").style.visibility = "hidden";
    document.querySelector("#remote").style.visibility = "hidden";
};

const update = function () {
    return jsonrpc.getProperties().then((properties) => {
        document.querySelector("#send").disabled = false;
        document.querySelector("#insert").disabled = false;
        document.querySelector("#add").disabled = false;
        document.querySelector("#paste input").disabled = false;
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
        document.querySelector("#play").disabled = false;
        if (0 === properties.totaltime) {
            document.querySelector("#time").disabled = true;
            document.querySelector("#rewind").disabled = true;
            document.querySelector("#pause").disabled = true;
            document.querySelector("#forward").disabled = true;
        } else {
            document.querySelector("#time").disabled = false;
            document.querySelector("#rewind").disabled = false;
            document.querySelector("#pause").disabled = false;
            document.querySelector("#forward").disabled = false;
        }
        onSeek({ "player": { "playerid": 1, "time": properties.time } });

        onVolumeChanged(properties);

        onPropertyChanged({
            "player":   { "playerid": 1 },
            "property": { "repeat": properties.repeat }
        });
        onPropertyChanged({
            "player":   { "playerid": 1 },
            "property": { "shuffled": properties.shuffled }
        });

        document.querySelector("#contextmenu").disabled = false;
        document.querySelector("#up").disabled = false;
        document.querySelector("#info").disabled = false;
        document.querySelector("#left").disabled = false;
        document.querySelector("#select").disabled = false;
        document.querySelector("#right").disabled = false;
        document.querySelector("#back").disabled = false;
        document.querySelector("#down").disabled = false;
        document.querySelector("#osd").disabled = false;
    }).catch(notify);
};

const cast = function (menuItemId) {
    // Récupérer l'URL dans la zone de saisie ou celle de l'onglet courant.
    let promise;
    if (document.querySelector("#paste input").checked) {
        promise = Promise.resolve(document.querySelector("textarea").value);
    } else {
        const queryInfo = {
            "active":        true,
            "currentWindow": true
        };
        promise = browser.tabs.query(queryInfo).then(([{ url }]) => url);
    }

    promise.then((popupUrl) => {
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

const paste = function (event) {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#paste input").disabled) {
        return;
    }

    const input = document.querySelector("#paste input");
    // Inverser l'état si l'origine du changement vient d'un raccourci clavier.
    if (undefined === event) {
        input.checked = !input.checked;
    }

    if (input.checked) {
        document.querySelector("#playing").style.visibility = "hidden";
        document.querySelector("#remote").style.visibility = "hidden";
        document.querySelector("#preferences").disabled = true;
        document.querySelector("#report").disabled = true;
        document.querySelector("#rate").disabled = true;
        document.querySelector("textarea").focus();
    } else {
        document.querySelector("#playing").style.visibility = "visible";
        document.querySelector("#remote").style.visibility = "visible";
        document.querySelector("#preferences").disabled = false;
        document.querySelector("#report").disabled = false;
        document.querySelector("#rate").disabled = false;
    }
};

const preferences = function () {
    browser.runtime.openOptionsPage().then(close);
};

const report = function () {
    browser.tabs.create({
        "url": "https://github.com/regseb/castkodi"
    }).then(close);
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

const setMute = function (event) {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#mute input").disabled) {
        return;
    }


    const input = document.querySelector("#mute input");
    // Inverser l'état si l'origine du changement vient d'un raccourci clavier.
    if (undefined === event) {
        input.checked = !input.checked;
    }

    if (input.checked) {
        document.querySelector("#volume").classList.add("disabled");
    } else {
        document.querySelector("#volume").classList.remove("disabled");
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

    document.querySelector("#mute input").checked = false;
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
        document.querySelector("#repeat-off").style.display = "none";
        document.querySelector("#repeat-all").style.display = "inline-block";
        off.checked = false;
        all.checked = true;
    } else if (all.checked) {
        document.querySelector("#repeat-all").style.display = "none";
        document.querySelector("#repeat-one").style.display = "inline-block";
        all.checked = false;
        one.checked = true;
    } else {
        document.querySelector("#repeat-one").style.display = "none";
        document.querySelector("#repeat-off").style.display = "inline-block";
        one.checked = false;
        off.checked = true;
    }
    jsonrpc.setRepeat().catch(notify);
};

const shuffle = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#shuffle input").disabled) {
        return;
    }

    const input = document.querySelector("#shuffle input");
    jsonrpc.setShuffle(input.checked).catch(notify);
};

const contextMenu = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#contextmenu").disabled) {
        return;
    }

    jsonrpc.contextMenu().catch(notify);
};

const up = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#up").disabled) {
        return;
    }

    jsonrpc.up().catch(notify);
};

const info = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#info").disabled) {
        return;
    }

    jsonrpc.info().catch(notify);
};

const left = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#left").disabled) {
        return;
    }

    jsonrpc.left().catch(notify);
};

const select = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#select").disabled) {
        return;
    }

    jsonrpc.select().catch(notify);
};

const right = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#right").disabled) {
        return;
    }

    jsonrpc.right().catch(notify);
};

const back = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#back").disabled) {
        return;
    }

    jsonrpc.back().catch(notify);
};

const down = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#down").disabled) {
        return;
    }

    jsonrpc.down().catch(notify);
};

const showOSD = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#osd").disabled) {
        return;
    }

    jsonrpc.showOSD().catch(notify);
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
document.querySelector("#paste").onchange = paste;
document.querySelector("#preferences").onclick = preferences;
document.querySelector("#report").onclick = report;
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

document.querySelector("#mute input").onchange = setMute;
document.querySelector("#volume").oninput = setVolume;

for (const input of document.querySelectorAll("#repeat input")) {
    input.onclick = repeat;
}
document.querySelector("#shuffle").onchange = shuffle;

document.querySelector("#contextmenu").onclick = contextMenu;
document.querySelector("#up").onclick = up;
document.querySelector("#info").onclick = info;
document.querySelector("#left").onclick = left;
document.querySelector("#select").onclick = select;
document.querySelector("#right").onclick = right;
document.querySelector("#back").onclick = back;
document.querySelector("#down").onclick = down;
document.querySelector("#osd").onclick = showOSD;

document.querySelector("#configure").onclick = preferences;

// Insérer le code SVG des icônes dans la page pour pouvoir changer leur couleur
// avec la feuille de style.
for (const element of document.querySelectorAll("object")) {
    if ("loading" !== element.parentNode.id) {
        fetch(element.data).then((r) => r.text())
                           .then((data) => {
            const svg = new DOMParser().parseFromString(data, "image/svg+xml");
            element.appendChild(svg.documentElement);
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
        case "F8":          setMute();      break;
        case "-":           setVolume(-10); break;
        case "+": case "=": setVolume(10);  break;
        case "c": case "C": contextMenu();  break;
        case "ArrowUp":     up();           break;
        case "i": case "I": info();         break;
        case "ArrowLeft":   left();         break;
        case "Enter":       select();       break;
        case "ArrowRight":  right();        break;
        case "Backspace":   back();         break;
        case "ArrowDown":   down();         break;
        case "m": case "M": showOSD();      break;
        // Appliquer le traitement par défaut pour les autres entrées.
        default: return;
    }
    event.preventDefault();
};

interval = setInterval(passing, 1000);

browser.storage.local.get().then((config) => {
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
