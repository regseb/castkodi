/**
 * @module
 */

import { cast, kodi } from "../core/index.js";
import { notify }     from "../core/notify.js";

/**
 * La position de l'élément courant dans la liste de lecture ; ou
 * <code>-1</code>.
 *
 * @type {number}
 */
let position = -1;

/**
 * La vitesse de lecture.
 *
 * @type {number}
 */
let speed = 0;

/**
 * L'identifiant de l'intervalle faisant avancer la barre de progression.
 *
 * @type {?Timeout}
 */
let interval = null;

const onSeek = function (timestamp) {
    const time = document.querySelector("#time");
    const max = Number.parseInt(time.max, 10);
    time.valueAsNumber = Math.min(timestamp, max);

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
    position = -1;
    speed = 0;
    document.querySelector("#time").disabled = true;
    onSeek(0);

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

/* eslint-disable unicorn/no-keyword-prefix */
const onSpeedChanged = function (newSpeed) {
    speed = newSpeed;
    /* eslint-enable unicorn/no-keyword-prefix */
    document.querySelector("#time").disabled = false;

    document.querySelector("#previous").disabled = false;
    document.querySelector("#rewind").disabled = false;
    document.querySelector("#stop").disabled = false;
    if (1 === speed) {
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

const onPropertyChanged = function (properties) {
    if ("repeat" in properties) {
        document.querySelector(`[name="repeat"][value="${properties.repeat}"]`)
                                                                .checked = true;
        document.querySelector("#repeat-off").style.display = "none";
        document.querySelector("#repeat-all").style.display = "none";
        document.querySelector("#repeat-one").style.display = "none";
        document.querySelector(`#repeat-${properties.repeat}`).style.display =
                                                                 "inline-block";
    }
    if ("shuffled" in properties) {
        document.querySelector("#shuffle input").checked = properties.shuffled;
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

const splash = function (err) {
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

const update = async function () {
    try {
        const properties = await kodi.player.getProperties([
            "position", "repeat", "shuffled", "speed", "timestamp",
            "totaltimestamp",
        ]);
        document.querySelector("#send").disabled = false;
        document.querySelector("#insert").disabled = false;
        document.querySelector("#add").disabled = false;
        document.querySelector("#paste input").disabled = false;
        document.querySelector("#loading").style.display = "none";
        document.querySelector("#rate").style.display = "inline-block";

        position = properties.position;
        if (-1 === properties.position) {
            onStop();
        } else {
            onSpeedChanged(properties.speed);
        }

        document.querySelector("#time").max =
                                           properties.totaltimestamp.toString();
        document.querySelector("#play").disabled = false;
        if (0 === properties.totaltimestamp) {
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
        onSeek(properties.timestamp);

        onVolumeChanged(await kodi.application.getProperties([
            "muted", "volume",
        ]));

        onPropertyChanged({
            repeat:   properties.repeat,
            shuffled: properties.shuffled,
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

        document.querySelector("#fullscreen").disabled = false;
    } catch (err) {
        splash(err);
    }
};

const mux = async function () {
    if (document.querySelector("#paste input").checked) {
        return Promise.resolve(document.querySelector("textarea").value);
    }

    const queryInfo = { active: true, currentWindow: true };
    const tabs = await browser.tabs.query(queryInfo);
    return tabs[0].url;
};

const send = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#send").disabled) {
        return;
    }

    const url = await mux();
    try {
        await cast("send", [url]);
        close();
    } catch (err) {
        notify(err);
    }
};

const insert = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#insert").disabled) {
        return;
    }

    const url = await mux();
    try {
        await cast("insert", [url]);
        close();
    } catch (err) {
        notify(err);
    }
};

const add = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#add").disabled) {
        return;
    }

    const url = await mux();
    try {
        await cast("add", [url]);
        close();
    } catch (err) {
        notify(err);
    }
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

const change = async function (event) {
    await browser.storage.local.set({
        "server-active": event.target.selectedIndex,
    });
    document.location.reload();
};

const preferences = async function () {
    await browser.runtime.openOptionsPage();
    close();
};

const report = async function () {
    await browser.tabs.create({ url: "https://github.com/regseb/castkodi" });
    close();
};

const rate = async function () {
    await browser.tabs.create({
        url: "https://addons.mozilla.org/addon/castkodi/reviews/",
    });
    close();
};

const previous = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#previous").disabled) {
        return;
    }

    kodi.player.previous().catch(splash);
};

const rewind = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#rewind").disabled) {
        return;
    }

    try {
        await kodi.player.setSpeed("decrement");
    } catch (err) {
        splash(err);
    }
};

const stop = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#stop").disabled) {
        return;
    }

    kodi.player.stop().catch(splash);
};

const playPause = async function () {
    if (-1 === position) {
        position = 0;
        kodi.player.open(position).catch(splash);
    } else {
        // Annuler l'action (venant d'un raccourci clavier) si le bouton est
        // désactivé (car la connexion à Kodi a échouée).
        if (document.querySelector("#pause").disabled) {
            return;
        }

        try {
            speed = await kodi.player.playPause();
        } catch (err) {
            splash(err);
        }
    }
};

const forward = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#forward").disabled) {
        return;
    }

    try {
        speed = await kodi.player.setSpeed("increment");
    } catch (err) {
        splash(err);
    }
};

const next = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#next").disabled) {
        return;
    }

    kodi.player.next().catch(splash);
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
    kodi.application.setMute(input.checked).catch(splash);
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
    kodi.application.setVolume(input.valueAsNumber).catch(splash);
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
    kodi.player.setRepeat().catch(splash);
};

const shuffle = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#shuffle input").disabled) {
        return;
    }

    const input = document.querySelector("#shuffle input");
    kodi.player.setShuffle(input.checked).catch(splash);
};

const contextMenu = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#contextmenu").disabled) {
        return;
    }

    kodi.input.contextMenu().catch(splash);
};

const up = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#up").disabled) {
        return;
    }

    kodi.input.up().catch(splash);
};

const info = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#info").disabled) {
        return;
    }

    kodi.input.info().catch(splash);
};

const left = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#left").disabled) {
        return;
    }

    kodi.input.left().catch(splash);
};

const select = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#select").disabled) {
        return;
    }

    kodi.input.select().catch(splash);
};

const right = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#right").disabled) {
        return;
    }

    kodi.input.right().catch(splash);
};

const back = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#back").disabled) {
        return;
    }

    kodi.input.back().catch(splash);
};

const down = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#down").disabled) {
        return;
    }

    kodi.input.down().catch(splash);
};

const showOSD = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#osd").disabled) {
        return;
    }

    kodi.input.showOSD().catch(splash);
};

const setFullscreen = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#fullscreen").disabled) {
        return;
    }

    kodi.gui.setFullscreen().catch(splash);
};

const passing = function () {
    if (0 === speed) {
        return;
    }

    const time = document.querySelector("#time");
    onSeek(time.valueAsNumber + speed);
};

const move = function () {
    clearInterval(interval);
    const time = document.querySelector("#time");

    onSeek(time.valueAsNumber);
};

const seek = function () {
    interval = setInterval(passing, 1000);
    const time = document.querySelector("#time");
    kodi.player.seek(time.valueAsNumber).catch(splash);
};


document.querySelector("#send").addEventListener("click", send);
document.querySelector("#insert").addEventListener("click", insert);
document.querySelector("#add").addEventListener("click", add);
document.querySelector("#paste").addEventListener("change", paste);
for (const input of document.querySelectorAll("select")) {
    input.addEventListener("change", change);
}
document.querySelector("#preferences").addEventListener("click", preferences);
document.querySelector("#report").addEventListener("click", report);
document.querySelector("#rate").addEventListener("click", rate);

document.querySelector("#time").addEventListener("input", move);
document.querySelector("#time").addEventListener("change", seek);

document.querySelector("#previous").addEventListener("click", previous);
document.querySelector("#rewind").addEventListener("click", rewind);
document.querySelector("#stop").addEventListener("click", stop);
document.querySelector("#pause").addEventListener("click", playPause);
document.querySelector("#play").addEventListener("click", playPause);
document.querySelector("#forward").addEventListener("click", forward);
document.querySelector("#next").addEventListener("click", next);

document.querySelector("#mute input").addEventListener("change", setMute);
document.querySelector("#volume").addEventListener("input", setVolume);

for (const input of document.querySelectorAll("#repeat input")) {
    input.addEventListener("click", repeat);
}
document.querySelector("#shuffle").addEventListener("change", shuffle);

document.querySelector("#contextmenu").addEventListener("click", contextMenu);
document.querySelector("#up").addEventListener("click", up);
document.querySelector("#info").addEventListener("click", info);
document.querySelector("#left").addEventListener("click", left);
document.querySelector("#select").addEventListener("click", select);
document.querySelector("#right").addEventListener("click", right);
document.querySelector("#back").addEventListener("click", back);
document.querySelector("#down").addEventListener("click", down);
document.querySelector("#osd").addEventListener("click", showOSD);

document.querySelector("#fullscreen").addEventListener("click", setFullscreen);

document.querySelector("#configure").addEventListener("click", preferences);

// Insérer le code SVG des icônes dans la page pour pouvoir changer leur couleur
// avec la feuille de style.
for (const element of document.querySelectorAll("object")) {
    if ("loading" !== element.parentNode.id) {
        fetch(element.data).then((r) => r.text())
                           .then((text) => {
            const svg = new DOMParser().parseFromString(text, "image/svg+xml");
            element.append(svg.documentElement);
            element.removeAttribute("data");
        });
    }
}

globalThis.focus();
globalThis.addEventListener("keydown", (event) => {
    // Ignorer les entrées avec une touche de modification.
    if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    // Écrire normalement les caractères dans la zone de texte (sauf pour la
    // touche Entrée qui envoi l'URL saisie).
    if ("TEXTAREA" === event.target.tagName) {
        if ("Enter" === event.key) {
            send();
            event.preventDefault();
        }
        return;
    }

    switch (event.key) {
        case "p": case "P": send();          break;
        case "n": case "N": insert();        break;
        case "q": case "Q": add();           break;
        case "v": case "V": paste();         break;
        case "PageUp":      previous();      break;
        case "r": case "R": rewind();        break;
        case "x": case "X": stop();          break;
        case " ":           playPause();     break;
        case "f": case "F": forward();       break;
        case "PageDown":    next();          break;
        case "F8":          setMute();       break;
        case "-":           setVolume(-1);   break;
        case "+": case "=": setVolume(1);    break;
        case "c": case "C": contextMenu();   break;
        case "ArrowUp":     up();            break;
        case "i": case "I": info();          break;
        case "ArrowLeft":   left();          break;
        case "Enter":       select();        break;
        case "ArrowRight":  right();         break;
        case "Backspace":   back();          break;
        case "ArrowDown":   down();          break;
        case "m": case "M": showOSD();       break;
        case "Tab":         setFullscreen(); break;
        // Appliquer le traitement par défaut pour les autres entrées.
        default: return;
    }
    event.preventDefault();
});
globalThis.addEventListener("keyup", (event) => {
    // Désactiver l'actionnement des boutons avec la touche Espace.
    if (" " === event.key) {
        event.preventDefault();
    }
});
globalThis.addEventListener("wheel", (event) => {
    if (0 === event.deltaY) {
        return;
    }
    setVolume(event.deltaY * -1);
    event.preventDefault();
});

interval = setInterval(passing, 1000);

browser.storage.local.get().then((config) => {
    if ("multi" === config["server-mode"]) {
        for (const input of document.querySelectorAll("select")) {
            config["server-list"].forEach((server, index) => {
                const name = (/^\s*$/u).test(server.name)
                            ? browser.i18n.getMessage("menus_noName", index + 1)
                            : server.name;
                input[index] = new Option(name,
                                          index,
                                          index === config["server-active"],
                                          index === config["server-active"]);
            });
        }
        document.querySelector("article span").style.display = "inline";
    }
});

kodi.application.onVolumeChanged.addListener(onVolumeChanged);
kodi.player.onAVStart.addListener(update);
kodi.player.onPause.addListener(onSpeedChanged);
kodi.player.onPlay.addListener(update);
kodi.player.onPropertyChanged.addListener(onPropertyChanged);
kodi.player.onResume.addListener(onSpeedChanged);
kodi.player.onSeek.addListener(onSeek);
kodi.player.onSpeedChanged.addListener(onSpeedChanged);
kodi.player.onStop.addListener(onStop);
update();
