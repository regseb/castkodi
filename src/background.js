/**
 * @module background
 */

import * as jsonrpc from "./core/jsonrpc.js";
import { notify }   from "./core/notify.js";
import { extract }  from "./core/scrapers.js";

/**
 * La liste des contextes où seront ajouté les options dans le menu contextuel.
 *
 * @constant {Array.<string>} CONTEXTS
 */
const CONTEXTS = [
    "audio", "browser_action", "frame", "link", "page", "selection", "tab",
    "video"
];

/**
 * Diffuse un média sur Kodi.
 *
 * @function cast
 * @param {Object} info Les informations fournies par le menu contextuel ou la
 *                      pop-up.
 */
const cast = function (info) {
    const urls = [info.selectionText, info.linkUrl, info.srcUrl, info.frameUrl,
                  info.pageUrl, info.popupUrl];
    let url = urls.find((u) => undefined !== u && "" !== u);
    // Si l'URL n'a pas de schéma : ajouter le protocole HTTP.
    if (!(/^[a-z-]+:/iu).test(url)) {
        url = url.replace(/^\/*/u, "http://");
    }

    extract(url).then(function (file) {
        switch (info.menuItemId) {
            case "send":   return jsonrpc.send(file);
            case "insert": return jsonrpc.insert(file);
            case "add":    return jsonrpc.add(file);
            default: throw new Error(info.menuItemId + " is not supported");
        }
    }).then(function () {
        return browser.storage.local.get(["general-history"]);
    }).then(function (config) {
        return config["general-history"] ? browser.history.addUrl({ url })
                                         : Promise.resolve();
    }).catch(notify);
};

/**
 * Ajoute les options dans les menus contextuels.
 *
 * @function menu
 * @param {Object} changes Les paramètres de la configuration modifiés.
 */
const menu = function (changes) {
    // Ignorer tous les changements sauf ceux liés au menu contextuel.
    if (!("menus-send" in changes) && !("menus-insert" in changes) &&
            !("menus-add" in changes)) {
        return;
    }
    // Vider les options du menu contextuel, puis ajouter les options.
    browser.menus.removeAll().then(function () {
        return browser.storage.local.get();
    }).then(function (config) {
        // Si au moins deux options doivent être affichées : les regrouper dans
        // une option parente.
        if (config["menus-send"] && config["menus-insert"] ||
                config["menus-send"] && config["menus-add"] ||
                config["menus-insert"] && config["menus-add"]) {
            browser.menus.create({
                "contexts": CONTEXTS,
                "id":       "parent",
                "title":    browser.i18n.getMessage("menus_firstParent")
            });
            if (config["menus-send"]) {
                browser.menus.create({
                    "id":       "send",
                    "parentId": "parent",
                    "title":    browser.i18n.getMessage("menus_secondSend")
                });
            }
            if (config["menus-insert"]) {
                browser.menus.create({
                    "id":       "insert",
                    "parentId": "parent",
                    "title":    browser.i18n.getMessage("menus_secondInsert")
                });
            }
            if (config["menus-add"]) {
                browser.menus.create({
                    "id":       "add",
                    "parentId": "parent",
                    "title":    browser.i18n.getMessage("menus_secondAdd")
                });
            }
        } else if (config["menus-send"]) {
            browser.menus.create({
                "contexts": CONTEXTS,
                "id":       "send",
                "title":    browser.i18n.getMessage("menus_firstSend")
            });
        } else if (config["menus-insert"]) {
            browser.menus.create({
                "contexts": CONTEXTS,
                "id":       "insert",
                "title":    browser.i18n.getMessage("menus_firstInsert")
            });
        } else if (config["menus-add"]) {
            browser.menus.create({
                "contexts": CONTEXTS,
                "id":       "add",
                "title":    browser.i18n.getMessage("menus_firstAdd")
            });
        }
    });
};

browser.storage.local.get().then(function (config) {
    // Migrer les anciennes données (avant la version 1.0.0).
    for (const key of ["port", "username", "password", "host"]) {
        if (key in config) {
            browser.storage.local.set({
                ["connection-" + key]: config[key]
            });
            browser.storage.local.remove(key);
        }
    }
    // Renommer la propriété "menus-play" (avant la version 1.5.0).
    if ("menus-play" in config) {
        browser.storage.local.set({ "menus-send": config["menus-play"] });
        browser.storage.local.remove("menus-play");
    }
    // Supprimer la propriété "airmozilla-format" (avant la version 3.0.0).
    browser.storage.local.remove("airmozilla-format");

    // Définir des valeurs par défaut.
    if (!("general-history" in config)) {
        browser.storage.local.set({ "general-history": false });
    }
    if (!("menus-send" in config)) {
        browser.storage.local.set({ "menus-send": true });
    }
    if (!("menus-insert" in config)) {
        browser.storage.local.set({ "menus-insert": true });
    }
    if (!("menus-add" in config)) {
        browser.storage.local.set({ "menus-add": true });
    }
    if (!("youtube-playlist" in config)) {
        browser.storage.local.set({ "youtube-playlist": "playlist" });
    }

    // Ajouter les options dans les menus contextuels et surveiller les futurs
    // changements de la configuration.
    menu({ "menus-send": null, "menu-insert": null, "menus-add": null });
    browser.storage.onChanged.addListener(menu);
});

browser.menus.onClicked.addListener(cast);
browser.runtime.onMessage.addListener(cast);
