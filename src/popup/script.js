/**
 * @module
 */

import { cast } from "../core/index.js";
import { kodi } from "../core/kodi.js";
import { complete } from "../core/labellers.js";
import { notify } from "../core/tools/notify.js";
import { ping } from "../core/tools/ping.js";

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

/**
 * L'élément de la liste de lecture en cours de déplacement.
 *
 * @type {?HTMLLIElement}
 */
let dragItem = null;

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

const closeDialog = function (event) {
    // Fermer la boite de dialogue si l'utilisateur clique en dehors de la
    // boite.
    if ("DIALOG" === event.target.nodeName) {
        const rect = event.target.getBoundingClientRect();
        if (rect.top > event.clientY || rect.bottom < event.clientY ||
                rect.left > event.clientX || rect.right < event.clientX) {
            event.target.close();
        }
    }
};

const mux = async function () {
    if (document.querySelector("#paste input").checked) {
        return document.querySelector("textarea").value;
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

const previous = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#previous").disabled) {
        return;
    }

    try {
        await kodi.player.goTo("previous");
    } catch (err) {
        splash(err);
    }
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

const stop = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#stop").disabled) {
        return;
    }

    try {
        await kodi.player.stop();
    } catch (err) {
        splash(err);
    }
};

const playPause = async function () {
    const play = document.querySelector("#play");
    if ("open" === play.dataset.action) {
        // Annuler l'action (venant d'un raccourci clavier) si le bouton est
        // désactivé (car la connexion à Kodi a échouée).
        if (play.disabled) {
            return;
        }

        try {
            await kodi.player.open();
        } catch (err) {
            splash(err);
        }
    } else {
        // Annuler l'action (venant d'un raccourci clavier) si le bouton est
        // désactivé.
        if (document.querySelector("#pause").disabled) {
            return;
        }

        try {
            await kodi.player.playPause();
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
        await kodi.player.setSpeed("increment");
    } catch (err) {
        splash(err);
    }
};

const next = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#next").disabled) {
        return;
    }

    try {
        await kodi.player.goTo("next");
    } catch (err) {
        splash(err);
    }
};

const setMute = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#mute input").disabled) {
        return;
    }

    try {
        await kodi.application.setMute();
    } catch (err) {
        splash(err);
    }
};

const setVolume = async function (diff) {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#volume").disabled) {
        return;
    }

    try {
        if ("increment" === diff || "decrement" === diff) {
            await kodi.application.setVolume(diff);
        } else {
            const input = document.querySelector("#volume");
            await kodi.application.setVolume(input.valueAsNumber);
        }
    } catch (err) {
        splash(err);
    }
};

const contextMenu = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#contextmenu").disabled) {
        return;
    }

    try {
        await kodi.input.contextMenu();
    } catch (err) {
        splash(err);
    }
};

const up = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#up").disabled) {
        return;
    }

    try {
        await kodi.input.up();
    } catch (err) {
        splash(err);
    }
};

const info = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#info").disabled) {
        return;
    }

    try {
        await kodi.input.info();
    } catch (err) {
        splash(err);
    }
};

const left = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#left").disabled) {
        return;
    }

    try {
        await kodi.input.left();
    } catch (err) {
        splash(err);
    }
};

const select = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#select").disabled) {
        return;
    }

    try {
        await kodi.input.select();
    } catch (err) {
        splash(err);
    }
};

const right = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#right").disabled) {
        return;
    }

    try {
        await kodi.input.right();
    } catch (err) {
        splash(err);
    }
};

const back = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#back").disabled) {
        return;
    }

    try {
        await kodi.input.back();
    } catch (err) {
        splash(err);
    }
};

const down = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#down").disabled) {
        return;
    }

    try {
        await kodi.input.down();
    } catch (err) {
        splash(err);
    }
};

const showOSD = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#osd").disabled) {
        return;
    }

    try {
        await kodi.input.showOSD();
    } catch (err) {
        splash(err);
    }
};

const home = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#home").disabled) {
        return;
    }

    try {
        await kodi.input.home();
    } catch (err) {
        splash(err);
    }
};

const setFullscreen = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#fullscreen").disabled) {
        return;
    }

    try {
        await kodi.gui.setFullscreen();
    } catch (err) {
        splash(err);
    }
};

const openSendText = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#opensendtext").disabled) {
        return;
    }

    const dialog = document.querySelector("#dialogsendtext");
    if (!dialog.open) {
        const text = dialog.querySelector(`input[name="text"]`);
        text.type = "text";
        text.value = "";
        dialog.showModal();
    }
};

const sendText = async function (event) {
    const dialog = event.target;
    if ("sendtext" === dialog.returnValue) {
        const text = dialog.querySelector(`input[name="text"]`);
        const done = dialog.querySelector(`input[name="done"]`);
        try {
            await kodi.input.sendText(text.value, done.checked);
        } catch (err) {
            splash(err);
        }
    }
};

const openSubtitle = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#opensubtitle").disabled) {
        return;
    }

    const dialog = document.querySelector("#dialogsubtitle");
    if (!dialog.open) {
        const subtitle = dialog.querySelector(`textarea[name="subtitle"]`);
        subtitle.value = "";
        dialog.showModal();
    }
};

const addSubtitle = async function (event) {
    const dialog = event.target;
    if ("addsubtitle" === dialog.returnValue) {
        const subtitle = dialog.querySelector(`textarea[name="subtitle"]`);
        try {
            await kodi.player.addSubtitle(subtitle.value);
        } catch (err) {
            splash(err);
        }
    }
};

const showPlayerProcessInfo = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#playerprocessinfo").disabled) {
        return;
    }

    try {
        await kodi.input.showPlayerProcessInfo();
    } catch (err) {
        splash(err);
    }
};

const openQuit = function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#openquit").disabled) {
        return;
    }

    const dialog = document.querySelector("#dialogquit");
    if (!dialog.open) {
        dialog.showModal();
    }
};

const quit = async function (event) {
    const dialog = event.target;
    try {
        switch (dialog.returnValue) {
            case "shutdown":
                await kodi.system.shutdown();
                close();
                break;
            case "suspend":
                await kodi.system.suspend();
                close();
                break;
            case "hibernate":
                await kodi.system.hibernate();
                close();
                break;
            case "reboot":
                await kodi.system.reboot();
                close();
                break;
            default:
                // Ne rien faire avec le bouton Annuler.
        }
    } catch (err) {
        splash(err);
    }
};

const repeat = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector(`[name="repeat"]`).disabled) {
        return;
    }

    try {
        await kodi.player.setRepeat();
    } catch (err) {
        splash(err);
    }
};

const shuffle = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#shuffle input").disabled) {
        return;
    }

    try {
        await kodi.player.setShuffle();
    } catch (err) {
        splash(err);
    }
};

const clear = async function () {
    // Annuler l'action (venant d'un raccourci clavier) si le bouton est
    // désactivé.
    if (document.querySelector("#clear").disabled) {
        return;
    }

    try {
        await kodi.playlist.clear();
    } catch (err) {
        splash(err);
    }
};

const play = async function (event) {
    const li = event.target.closest("li");
    const index = Array.from(li.parentNode.children).indexOf(li);
    try {
        await kodi.player.open(index);
    } catch (err) {
        splash(err);
    }
};

const remove = async function (event) {
    const li = event.target.closest("li");
    const index = Array.from(li.parentNode.children).indexOf(li);
    try {
        await kodi.playlist.remove(index);
    } catch (err) {
        splash(err);
    }
};

const web = async function () {
    const url = document.querySelector("#web").dataset.url;
    await browser.tabs.create({ url });
    close();
};

const feedback = async function () {
    await browser.tabs.create({ url: "https://github.com/regseb/castkodi" });
    close();
};

const donate = async function () {
    await browser.tabs.create({ url: "https://www.paypal.me/sebastienregne" });
    close();
};

const rate = async function () {
    let url;
    const { name } = await browser.runtime.getBrowserInfo();
    switch (name) {
        case "Chrome":
            url = "https://chrome.google.com/webstore/detail/cast-kodi" +
                                    "/gojlijimdlgjlliggedhakpefimkedmb/reviews";
            break;
        case "Firefox":
            url = "https://addons.mozilla.org/addon/castkodi/";
            break;
        default:
            throw new Error("unknown browser");
    }
    await browser.tabs.create({ url });
    close();
};

const preferences = async function () {
    await browser.runtime.openOptionsPage();
    close();
};

/**
 * Gère le début d'un glissement d'un élément.
 *
 * @param {DragEvent} event L'évènement du glissement.
 * @this {HTMLLIElement}
 */
const handleDragStart = function (event) {
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = "move";

    this.classList.add("drag");
    // eslint-disable-next-line consistent-this, unicorn/no-this-assignment
    dragItem = this;
};

/**
 * Gère le déplacement d'un glissement sur un élement déposable.
 *
 * @param {DragEvent} event L'évènement du glissement.
 * @this {HTMLLIElement}
 */
const handleDragOver = function (event) {
    event.preventDefault();

    const section = this.closest("section");
    const center = this.offsetTop - section.scrollTop + this.offsetHeight / 2;
    if (event.clientY < center) {
        this.classList.remove("drop-after");
        this.classList.add("drop-before");
    } else {
        this.classList.remove("drop-before");
        this.classList.add("drop-after");
    }

    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = "move";

    return false;
};

/**
 * Gère la sortie d'un élement déposable d'un glissement.
 *
 * @this {HTMLLIElement}
 */
const handleDragLeave = function () {
    this.classList.remove("drop-before", "drop-after");
};

/**
 * Gère le dépôt d'un élément de glissement.
 *
 * @param {DragEvent} event L'évènement du glissement.
 * @this {HTMLLIElement}
 */
const handleDrop = async function (event) {
    event.stopPropagation();

    if (dragItem !== this) {
        const items = Array.from(dragItem.parentElement.children);
        const source = items.indexOf(dragItem);
        let destination = items.indexOf(this);
        dragItem.remove();
        if (this.classList.contains("drop-before")) {
            this.before(dragItem);
        } else {
            ++destination;
            this.after(dragItem);
        }
        dragItem.scrollIntoView();
        try {
            await kodi.playlist.move(source, destination);
        } catch (err) {
            splash(err);
        }
    }
    this.classList.remove("drop-before", "drop-after");
    return false;
};

/**
 * Gère la fin du glissement.
 *
 * @this {HTMLLIElement}
 */
const handleDragEnd = function () {
    this.classList.remove("drag");
};

const handleAdd = function (item) {
    const template = document.querySelector("template");
    const clone = document.importNode(template.content, true);
    clone.querySelector("span").textContent = item.label;
    clone.querySelector("span").title = item.label;
    clone.querySelector("span").addEventListener("dblclick", play);
    clone.querySelector(".play").addEventListener("click", play);
    clone.querySelector(".remove").addEventListener("click", remove);
    if (position === item.position) {
        clone.querySelector("span").classList.add("active");
        for (const button of clone.querySelectorAll("button")) {
            button.disabled = true;
        }
    }
    const li = document.createElement("li");
    li.dataset.file = item.file;
    li.addEventListener("dragstart", handleDragStart, false);
    li.addEventListener("dragover",  handleDragOver,  false);
    li.addEventListener("dragleave", handleDragLeave, false);
    li.addEventListener("drop",      handleDrop,      false);
    li.addEventListener("dragend",   handleDragEnd,   false);
    li.draggable = true;
    li.append(clone);

    const ol = document.querySelector("#playlist-items ol");
    ol.insertBefore(li, ol.children[item.position]);
};

const handleClear = function () {
    const ol = document.querySelector("#playlist-items ol");
    ol.textContent = "";
};

const handleRemove = function (value) {
    document.querySelector(`#playlist-items li:nth-child(${value + 1})`)
            .remove();
};

const handleVolumeChanged = function (value) {
    const volume = document.querySelector("#volume");
    volume.valueAsNumber = value;
    volume.title = browser.i18n.getMessage("popup_volume_title",
                                           value.toString());
};

const handleMutedChanged = function (value) {
    const mute = document.querySelector("#mute input");
    mute.checked = value;

    const volume = document.querySelector("#volume");
    volume.classList.toggle("disabled", value);
};

const handleInputRequested = function ({ type, value }) {
    const dialog = document.querySelector("#dialogsendtext");
    if (!dialog.open) {
        const text = dialog.querySelector(`input[name="text"]`);
        switch (type) {
            case "date":
                text.type = "date";
                break;
            case "password":
            case "numericpassword":
                text.type = "password";
                break;
            case "number":
                text.type = "number";
                break;
            default:
                text.type = "text";
        }
        text.value = value;
        dialog.showModal();
    }
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

        document.querySelector("#opensubtitle").disabled = true;

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

        document.querySelector("#opensubtitle").disabled = false;

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
        document.querySelector("#pause").style.display = "flex";
    } else {
        document.querySelector("#pause").style.display = "none";
        document.querySelector("#play").style.display = "flex";
    }
};

const handleRepeatChanged = function (value) {
    document.querySelector(`[name="repeat"][value="${value}"]`).checked = true;
    document.querySelector("#repeat-off").classList.remove("checked");
    document.querySelector("#repeat-all").classList.remove("checked");
    document.querySelector("#repeat-one").classList.remove("checked");
    document.querySelector(`#repeat-${value}`).classList.add("checked");
};

const handleShuffledChanged = async function (value) {
    document.querySelector("#shuffle input").checked = value;

    const items = await kodi.playlist.getItems();
    const ol = document.querySelector("#playlist-items ol");
    if (0 === ol.children.length) {
        for await (const item of items.map(complete)) {
            handleAdd(item);
        }
        document.querySelector("#playlist-items").classList.remove("waiting");
    } else {
        for (const item of items) {
            const li = Array.from(ol.children)
                            .find((l) => item.file === l.dataset.file);
            if (li.querySelector("span").classList.contains("active")) {
                position = item.position;
            }
            li.remove();
            ol.append(li);
        }
    }
};

const handleTimeChanged = function (value) {
    const time = document.querySelector("#time");
    const max = Number.parseInt(time.max, 10);
    time.valueAsNumber = Math.min(value, max);

    time.previousElementSibling.textContent = 3600 < max
           ? Math.trunc(time.valueAsNumber / 3600) + ":" +
             (Math.trunc(time.valueAsNumber / 60) % 60).toString()
                                                       .padStart(2, "0") + ":" +
             (time.valueAsNumber % 60).toString().padStart(2, "0")
           : Math.trunc(time.valueAsNumber / 60) + ":" +
             (time.valueAsNumber % 60).toString().padStart(2, "0");

    // Utiliser la taille du temps total pour que l'élément ait toujours la
    // même taille (même durant le passage à la dizaine).
    time.previousElementSibling.style.width =
                          time.nextElementSibling.offsetWidth.toString() + "px";
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

        time.nextElementSibling.textContent = 3600 < value
                        ? Math.trunc(value / 3600) + ":" +
                          (Math.trunc(value / 60) % 60).toString()
                                                       .padStart(2, "0") + ":" +
                          (value % 60).toString().padStart(2, "0")
                        : Math.trunc(value / 60) + ":" +
                          (value % 60).toString().padStart(2, "0");
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

const seek = async function () {
    interval = setInterval(passing, 1000);
    const time = document.querySelector("#time");
    try {
        await kodi.player.seek(time.valueAsNumber);
    } catch (err) {
        splash(err);
    }
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
        document.querySelector("#opensendtext").disabled = false;
        document.querySelector("#playerprocessinfo").disabled = false;
        document.querySelector("#openquit").disabled = false;

        document.querySelector("#clear").disabled = false;

        document.querySelector("#loading").style.display = "none";
        document.querySelector("#web").disabled = false;
        document.querySelector("#feedback").disabled = false;
        document.querySelector("#donate").disabled = false;
        document.querySelector("#rate").disabled = false;

        // Afficher le bouton vers l'interface Web de Kodi seulement si
        // celle-ci est accessible.
        const url = `http://${kodi.url.hostname}:8080`;
        if (await ping(url)) {
            document.querySelector("#web").dataset.url = url;
            document.querySelector("#web").style.display = "flex";
        }

        const cans = await kodi.system.getProperties([
            "canhibernate", "canreboot", "canshutdown", "cansuspend",
        ]);
        Object.entries(cans).filter(([_, v]) => !v)
                            .map(([k]) => k.slice(3))
                            .forEach((key) => {
            document.querySelector(`#dialogquit button[value="${key}"]`)
                    .remove();
        });
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
document.querySelector("#opensendtext").addEventListener("click", openSendText);
document.querySelector("#opensubtitle").addEventListener("click", openSubtitle);
document.querySelector("#playerprocessinfo").addEventListener(
    "click",
    showPlayerProcessInfo,
);
document.querySelector("#openquit").addEventListener("click", openQuit);

for (const input of document.querySelectorAll("#repeat input")) {
    input.addEventListener("click", repeat);
}
document.querySelector("#shuffle").addEventListener("change", shuffle);
document.querySelector("#clear").addEventListener("click", clear);

document.querySelector("#web").addEventListener("click", web);
document.querySelector("#feedback").addEventListener("click", feedback);
document.querySelector("#donate").addEventListener("click", donate);
document.querySelector("#rate").addEventListener("click", rate);
document.querySelector("#preferences").addEventListener("click", preferences);

document.querySelector("#dialogsendtext").addEventListener("close", sendText);
document.querySelector("#dialogsendtext").addEventListener("click",
                                                           closeDialog);
document.querySelector("#dialogsubtitle").addEventListener("close",
                                                           addSubtitle);
document.querySelector("#dialogsubtitle").addEventListener("click",
                                                           closeDialog);

document.querySelector("#dialogquit").addEventListener("close", quit);
document.querySelector("#dialogquit").addEventListener("click", closeDialog);

document.querySelector("#configure").addEventListener("click", preferences);

// Attention ! La popup n'a pas automatiquement le focus quand elle est ouverte
// dans le menu prolongeant la barre d'outils. https://bugzil.la/1623875
globalThis.addEventListener("keydown", (event) => {
    // Ignorer les entrées avec une touche de modification.
    if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    // Ignorer les raccourcis clavier quand une boite de dialogue est ouverte
    // (sauf pour la touche Entrée qui valide le formulaire).
    const dialog = event.target.closest("dialog");
    if (null !== dialog) {
        if ("Enter" === event.key) {
            dialog.close(dialog.querySelector(".primary").value);
            event.preventDefault();
        }
        return;
    }

    // Écrire normalement les caractères dans la zone de texte (sauf pour la
    // touche Entrée qui envoi l'URL saisie).
    if ("TEXTAREA" === event.target.nodeName) {
        if ("Enter" === event.key) {
            send();
            event.preventDefault();
        }
        return;
    }

    switch (event.key) {
        case "p": case "P": send();                  break;
        case "n": case "N": insert();                break;
        case "q": case "Q": add();                   break;
        case "v": case "V": paste();                 break;

        case "PageUp":      previous();              break;
        case "r": case "R": rewind();                break;
        case "x": case "X": stop();                  break;
        case " ":           playPause();             break;
        case "f": case "F": forward();               break;
        case "PageDown":    next();                  break;

        case "F8":          setMute();               break;
        case "-":           setVolume("decrement");  break;
        case "+": case "=": setVolume("increment");  break;

        case "c": case "C": contextMenu();           break;
        case "ArrowUp":     up();                    break;
        case "i": case "I": info();                  break;
        case "ArrowLeft":   left();                  break;
        case "Enter":       select();                break;
        case "ArrowRight":  right();                 break;
        case "Backspace":   back();                  break;
        case "ArrowDown":   down();                  break;
        case "m": case "M": showOSD();               break;

        case "Tab":         setFullscreen();         break;
        case "t": case "T": openSubtitle();          break;
        case "o": case "O": showPlayerProcessInfo(); break;
        case "s": case "S": openQuit();              break;
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
    // Garder le comportement classique de la molette dans une zone de texte.
    const textarea = event.target.closest("textarea");
    if (null !== textarea) {
        return;
    }
    // Garder le comportement classique de la molette pour la liste de lecture
    // lorsque la barre défilement est présente.
    const section = event.target.closest("#playlist-items");
    if (0 === event.deltaY ||
            null !== section && section.scrollHeight > section.clientHeight) {
        return;
    }

    setVolume(0 < event.deltaY ? "increment" : "decrement");
    event.preventDefault();
}, { passive: false });

interval = setInterval(passing, 1000);

const config = await browser.storage.local.get();
if ("multi" === config["server-mode"]) {
    for (const input of document.querySelectorAll("select")) {
        for (const [index, server] of config["server-list"].entries()) {
            const name = (/^\s*$/u).test(server.name)
                               ? browser.i18n.getMessage("menus_noName",
                                                         (index + 1).toString())
                               : server.name;
            input[index] = new Option(name,
                                      index,
                                      index === config["server-active"],
                                      index === config["server-active"]);
        }
    }
    document.querySelector("#server").style.visibility = "visible";
    document.querySelector("#splash li:last-child").style.display = "list-item";
}

kodi.application.onPropertyChanged.addListener(handlePropertyChanged);
kodi.input.onInputRequested.addListener(handleInputRequested);
kodi.player.onPropertyChanged.addListener(handlePropertyChanged);
kodi.playlist.onAdd.addListener(async (i) => handleAdd(await complete(i)));
kodi.playlist.onClear.addListener(handleClear);
kodi.playlist.onRemove.addListener(handleRemove);
await load();
