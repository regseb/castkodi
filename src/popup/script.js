/**
 * @module
 */

import { cast, kodi } from "../core/index.js";
import { complete }   from "../core/labellers.js";
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

const splash = function (err) {
    const article = document.querySelector("#splash");
    if ("PebkacError" === err.name) {
        article.querySelector("h1").textContent = err.title;
    } else {
        article.querySelector("h1").textContent =
                         browser.i18n.getMessage("notifications_unknown_title");
    }
    article.querySelector("p").textContent = err.message;
    article.style.display = "block";
    for (const section of document.querySelectorAll("section")) {
        section.style.visibility = "hidden";
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
        for (const section of document.querySelectorAll("section:not(#cast)")) {
            section.style.visibility = "hidden";
        }
        document.querySelector("textarea").focus();
    } else {
        for (const section of document.querySelectorAll("section:not(#cast)")) {
            section.style.visibility = "visible";
        }
    }
};

const change = async function (event) {
    await browser.storage.local.set({
        "server-active": event.target.selectedIndex,
    });
    document.location.reload();
};

const previous = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#previous").disabled) {
        return;
    }

    kodi.player.goTo("previous").catch(splash);
};

const rewind = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#rewind").disabled) {
        return;
    }

    kodi.player.setSpeed("decrement").catch(splash);
};

const stop = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#stop").disabled) {
        return;
    }

    kodi.player.stop().catch(splash);
};

const playPause = function () {
    const play = document.querySelector("#play");
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé (car la connexion à Kodi a échouée).
    if (play.disabled) {
        return;
    }

    if ("open" === play.dataset.action) {
        kodi.player.open().catch(splash);
    } else {
        kodi.player.playPause().catch(splash);
    }
};

const forward = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#forward").disabled) {
        return;
    }

    kodi.player.setSpeed("increment").catch(splash);
};

const next = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#next").disabled) {
        return;
    }

    kodi.player.goTo("next").catch(splash);
};

const setMute = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#mute input").disabled) {
        return;
    }

    kodi.application.setMute().catch(splash);
};

const setVolume = function (diff) {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#volume").disabled) {
        return;
    }

    if ("increment" === diff || "decrement" === diff) {
        kodi.application.setVolume(diff).catch(splash);
    } else {
        const input = document.querySelector("#volume");
        kodi.application.setVolume(input.valueAsNumber).catch(splash);
    }
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

const home = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#home").disabled) {
        return;
    }

    kodi.input.home().catch(splash);
};

const setFullscreen = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#fullscreen").disabled) {
        return;
    }

    kodi.gui.setFullscreen().catch(splash);
};

const repeat = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector(`[name="repeat"]`).disabled) {
        return;
    }

    kodi.player.setRepeat().catch(splash);
};

const shuffle = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#shuffle input").disabled) {
        return;
    }

    kodi.player.setShuffle().catch(splash);
};

const clear = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#clear").disabled) {
        return;
    }

    kodi.playlist.clear().catch(splash);
};

const play = function (event) {
    const li = event.target.closest("li");
    const index = [...li.parentNode.children].indexOf(li);
    kodi.player.open(index).catch(splash);
};

const remove = function (event) {
    const li = event.target.closest("li");
    const index = [...li.parentNode.children].indexOf(li);
    kodi.playlist.remove(index).catch(splash);
};

const report = async function () {
    await browser.tabs.create({ url: "https://github.com/regseb/castkodi" });
    close();
};

const donate = async function () {
    await browser.tabs.create({ url: "https://www.paypal.me/sebastienregne" });
    close();
};

const rate = async function () {
    await browser.tabs.create({
        url: "https://addons.mozilla.org/addon/castkodi/reviews/",
    });
    close();
};

const preferences = async function () {
    await browser.runtime.openOptionsPage();
    close();
};

const handleVolumeChanged = function (value) {
    const volume = document.querySelector("#volume");
    volume.valueAsNumber = value;
    volume.title = browser.i18n.getMessage("popup_volume_title", value);
};

const handleMutedChanged = function (value) {
    const mute = document.querySelector("#mute input");
    mute.checked = value;

    const volume = document.querySelector("#volume");
    volume.classList.toggle("disabled", value);
};

const handlePositionChanged = function (value) {
    position = value;
    if (-1 === value) {
        document.querySelector("#time").disabled = true;

        document.querySelector("#previous").disabled = true;
        document.querySelector("#rewind").disabled = true;
        document.querySelector("#stop").disabled = true;
        document.querySelector("#play").dataset.action = "open";
        document.querySelector("#forward").disabled = true;
        document.querySelector("#next").disabled = true;

        // Ne pas activer les boutons pour répéter et mélanger la liste de
        // lecture des vidéos quand le lecteur vidéo est inactif.
        // https://github.com/xbmc/xbmc/issues/17896
        for (const input of document.querySelectorAll("#repeat input")) {
            input.disabled = true;
        }
        document.querySelector("#shuffle input").disabled = true;
    } else {
        document.querySelector("#time").disabled = false;

        document.querySelector("#previous").disabled = false;
        document.querySelector("#rewind").disabled = false;
        document.querySelector("#stop").disabled = false;
        document.querySelector("#play").dataset.action = "resume";
        document.querySelector("#forward").disabled = false;
        document.querySelector("#next").disabled = false;

        for (const input of document.querySelectorAll("#repeat input")) {
            input.disabled = false;
        }
        document.querySelector("#shuffle input").disabled = false;
    }

    for (const li of document.querySelectorAll("#playlist-items li")) {
        li.querySelector("span").classList.remove("active");
        for (const button of li.querySelectorAll("button")) {
            button.disabled = false;
        }
    }
    for (const li of document.querySelectorAll("#playlist-items" +
                                               ` li:nth-child(${value + 1})`)) {
        li.querySelector("span").classList.add("active");
        for (const button of li.querySelectorAll("button")) {
            button.disabled = true;
        }
    }
};

const handleSpeedChanged = function (value) {
    speed = value;
    if (1 === speed) {
        document.querySelector("#play").style.display = "none";
        document.querySelector("#pause").style.display = "inline";
    } else {
        document.querySelector("#pause").style.display = "none";
        document.querySelector("#play").style.display = "inline";
    }
};

const handleRepeatChanged = function (value) {
    document.querySelector(`[name="repeat"][value="${value}"]`).checked = true;
    document.querySelector("#repeat-off").classList.remove("checked");
    document.querySelector("#repeat-all").classList.remove("checked");
    document.querySelector("#repeat-one").classList.remove("checked");
    document.querySelector(`#repeat-${value}`).classList.add("checked");
};

const handleShuffledChanged = function (value) {
    document.querySelector("#shuffle input").checked = value;
};

const handleTimeChanged = function (value) {
    const time = document.querySelector("#time");
    const max = Number.parseInt(time.max, 10);
    time.valueAsNumber = Math.min(value, max);

    if (3600 < max) {
        time.previousElementSibling.textContent =
            Math.trunc(time.valueAsNumber / 3600) + ":" +
            (Math.trunc(time.valueAsNumber / 60) % 60).toString()
                                                      .padStart(2, "0") + ":" +
            (time.valueAsNumber % 60).toString().padStart(2, "0");
    } else {
        time.previousElementSibling.textContent =
            Math.trunc(time.valueAsNumber / 60) + ":" +
            (time.valueAsNumber % 60).toString().padStart(2, "0");
    }
};

const handleTotaltimeChanged = function (value) {
    document.querySelector("#time").max = value.toString();
    document.querySelector("#play").disabled = false;
    if (0 === value) {
        const time = document.querySelector("#time");
        time.disabled = true;
        time.previousElementSibling.style.visibility = "hidden";
        time.nextElementSibling.style.visibility = "hidden";
        document.querySelector("#rewind").disabled = true;
        document.querySelector("#pause").disabled = true;
        document.querySelector("#forward").disabled = true;

        time.nextElementSibling.textContent = "0:00";
    } else {
        const time = document.querySelector("#time");
        time.disabled = false;
        time.previousElementSibling.style.visibility = "visible";
        time.nextElementSibling.style.visibility = "visible";
        document.querySelector("#rewind").disabled = false;
        document.querySelector("#pause").disabled = false;
        document.querySelector("#forward").disabled = false;

        if (3600 < value) {
            time.nextElementSibling.textContent =
                Math.trunc(value / 3600) + ":" +
                (Math.trunc(value / 60) % 60).toString().padStart(2, "0") +
                ":" + (value % 60).toString().padStart(2, "0");
        } else {
            time.nextElementSibling.textContent =
                Math.trunc(value / 60) + ":" +
                (value % 60).toString().padStart(2, "0");
        }
    }
};

const handlePropertyChanged = function (properties) {
    if ("volume" in properties) {
        handleVolumeChanged(properties.volume);
    }
    if ("muted" in properties) {
        handleMutedChanged(properties.muted);
    }
    if ("position" in properties) {
        handlePositionChanged(properties.position);
    }
    if ("repeat" in properties) {
        handleRepeatChanged(properties.repeat);
    }
    if ("shuffled" in properties) {
        handleShuffledChanged(properties.shuffled);
    }
    if ("speed" in properties) {
        handleSpeedChanged(properties.speed);
    }
    // Mettre à jour le temps total avant le temps courant car celui-ci a besoin
    // du temps total.
    if ("totaltime" in properties) {
        handleTotaltimeChanged(properties.totaltime);
    }
    if ("time" in properties) {
        handleTimeChanged(properties.time);
    }
};

const handleAdd = function (item) {
    const template = document.querySelector("template");
    const clone = document.importNode(template.content, true);
    clone.querySelector("span").textContent = item.label;
    clone.querySelector("span").title = item.label;
    clone.querySelector(".play").addEventListener("click", play);
    clone.querySelector(".remove").addEventListener("click", remove);
    if (position === item.position) {
        clone.querySelector("span").classList.add("active");
        for (const button of clone.querySelectorAll("button")) {
            button.disabled = true;
        }
    }
    const li = document.createElement("li");
    li.append(clone);

    document.querySelector("#playlist-items > span").style.display = "none";
    const ol = document.querySelector("#playlist-items ol");
    ol.style.display = "block";
    ol.insertBefore(li, ol.children[item.position]);
};

const handleClear = function () {
    const ol = document.querySelector("#playlist-items ol");
    ol.style.display = "none";
    ol.textContent = "";
    document.querySelector("#playlist-items > span").style.display = "block";
};

const handleRemove = function (value) {
    document.querySelector(`#playlist-items li:nth-child(${value + 1})`)
            .remove();
};

const passing = function () {
    if (0 === speed) {
        return;
    }

    const time = document.querySelector("#time");
    handleTimeChanged(time.valueAsNumber + speed);
};

const move = function () {
    clearInterval(interval);
    const time = document.querySelector("#time");

    handleTimeChanged(time.valueAsNumber);
};

const seek = function () {
    interval = setInterval(passing, 1000);
    const time = document.querySelector("#time");
    kodi.player.seek(time.valueAsNumber).catch(splash);
};

const load = async function () {
    try {
        handlePropertyChanged(await kodi.player.getProperties([
            "position", "repeat", "shuffled", "speed", "time", "totaltime",
        ]));
        handlePropertyChanged(await kodi.application.getProperties([
            "muted", "volume",
        ]));

        document.querySelector("#send").disabled = false;
        document.querySelector("#insert").disabled = false;
        document.querySelector("#add").disabled = false;
        document.querySelector("#paste input").disabled = false;

        document.querySelector("#play").disabled = false;

        document.querySelector("#volume").disabled = false;
        document.querySelector("#mute input").disabled = false;

        document.querySelector("#contextmenu").disabled = false;
        document.querySelector("#up").disabled = false;
        document.querySelector("#info").disabled = false;
        document.querySelector("#left").disabled = false;
        document.querySelector("#select").disabled = false;
        document.querySelector("#right").disabled = false;
        document.querySelector("#back").disabled = false;
        document.querySelector("#down").disabled = false;
        document.querySelector("#osd").disabled = false;

        document.querySelector("#home").disabled = false;
        document.querySelector("#fullscreen").disabled = false;

        document.querySelector("#clear").disabled = false;

        document.querySelector("#loading").style.display = "none";
        document.querySelector("#report").disabled = false;
        document.querySelector("#donate").disabled = false;
        document.querySelector("#rate").disabled = false;

        const items = await kodi.playlist.getItems();
        if (0 === items.length) {
            document.querySelector("#playlist-items > span").style.display =
                                                                        "block";
        } else {
            for await (const item of items.map(complete)) {
                handleAdd(item);
            }
        }
    } catch (err) {
        splash(err);
    }
};


document.querySelector("#send").addEventListener("click", send);
document.querySelector("#insert").addEventListener("click", insert);
document.querySelector("#add").addEventListener("click", add);
document.querySelector("#paste").addEventListener("change", paste);
for (const input of document.querySelectorAll("select")) {
    input.addEventListener("change", change);
}

document.querySelector("#time").addEventListener("input", move);
document.querySelector("#time").addEventListener("change", seek);

document.querySelector("#previous").addEventListener("click", previous);
document.querySelector("#rewind").addEventListener("click", rewind);
document.querySelector("#stop").addEventListener("click", stop);
document.querySelector("#pause").addEventListener("click", playPause);
document.querySelector("#play").addEventListener("click", playPause);
document.querySelector("#forward").addEventListener("click", forward);
document.querySelector("#next").addEventListener("click", next);

document.querySelector("#volume").addEventListener("input", setVolume);
document.querySelector("#mute input").addEventListener("change", setMute);

document.querySelector("#contextmenu").addEventListener("click", contextMenu);
document.querySelector("#up").addEventListener("click", up);
document.querySelector("#info").addEventListener("click", info);
document.querySelector("#left").addEventListener("click", left);
document.querySelector("#select").addEventListener("click", select);
document.querySelector("#right").addEventListener("click", right);
document.querySelector("#back").addEventListener("click", back);
document.querySelector("#down").addEventListener("click", down);
document.querySelector("#osd").addEventListener("click", showOSD);

document.querySelector("#home").addEventListener("click", home);
document.querySelector("#fullscreen").addEventListener("click", setFullscreen);

for (const input of document.querySelectorAll("#repeat input")) {
    input.addEventListener("click", repeat);
}
document.querySelector("#shuffle").addEventListener("change", shuffle);
document.querySelector("#clear").addEventListener("click", clear);

document.querySelector("#report").addEventListener("click", report);
document.querySelector("#donate").addEventListener("click", donate);
document.querySelector("#rate").addEventListener("click", rate);
document.querySelector("#preferences").addEventListener("click", preferences);

document.querySelector("#configure").addEventListener("click", preferences);

// Attention ! La popup n'a pas automatiquement le focus quand elle est ouverte
// dans le menu prolongeant la barre d'outils.
// https://bugzilla.mozilla.org/show_bug.cgi?id=1623875
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
        case "p": case "P": send();                 break;
        case "n": case "N": insert();               break;
        case "q": case "Q": add();                  break;
        case "v": case "V": paste();                break;

        case "PageUp":      previous();             break;
        case "r": case "R": rewind();               break;
        case "x": case "X": stop();                 break;
        case " ":           playPause();            break;
        case "f": case "F": forward();              break;
        case "PageDown":    next();                 break;

        case "F8":          setMute();              break;
        case "-":           setVolume("decrement"); break;
        case "+": case "=": setVolume("increment"); break;

        case "c": case "C": contextMenu();          break;
        case "ArrowUp":     up();                   break;
        case "i": case "I": info();                 break;
        case "ArrowLeft":   left();                 break;
        case "Enter":       select();               break;
        case "ArrowRight":  right();                break;
        case "Backspace":   back();                 break;
        case "ArrowDown":   down();                 break;
        case "m": case "M": showOSD();              break;

        case "Tab":         setFullscreen();        break;
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
    // Garder le comportement classique de la molette pour la liste de lecture
    // lorsque la barre défilement est présent.
    const ol = event.target.closest("#playlist-items ol");
    if (0 === event.deltaY ||
            null !== ol && ol.scrollHeight > ol.clientHeight) {
        return;
    }

    setVolume(0 < event.deltaY ? "increment" : "decrement");
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
        document.querySelector("#server").style.visibility = "visible";
        document.querySelector("#splash li:last-child").style.display =
                                                                    "list-item";
    }
});

kodi.application.onPropertyChanged.addListener(handlePropertyChanged);
kodi.player.onPropertyChanged.addListener(handlePropertyChanged);
kodi.playlist.onAdd.addListener(async (i) => handleAdd(await complete(i)));
kodi.playlist.onClear.addListener(handleClear);
kodi.playlist.onRemove.addListener(handleRemove);
load();
