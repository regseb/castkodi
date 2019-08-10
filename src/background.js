/**
 * @module
 */

import { mux }     from "./core/index.js";
import { JSONRPC } from "./core/jsonrpc.js";
import { notify }  from "./core/notify.js";
import { extract } from "./core/scrapers.js";

/**
 * Les valeurs par défaut de la configuration.
 *
 * @constant {object}
 */
const DEFAULT_CONFIG = {
    "config-version":     1,
    "connection-host":    "",
    "general-history":    false,
    "menus-send":         true,
    "menus-insert":       true,
    "menus-add":          true,
    "contexts-audio":     true,
    "contexts-bookmark":  false,
    "contexts-frame":     true,
    "contexts-link":      true,
    "contexts-page":      true,
    "contexts-selection": true,
    "contexts-tab":       true,
    "contexts-video":     true,
    "youtube-playlist":   "playlist"
};

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {object}
 */
let jsonrpc = null;

/**
 * Diffuse un média sur Kodi.
 *
 * @function cast
 * @param {object} info Les informations fournies par le menu contextuel ou la
 *                      pop-up.
 */
const cast = function (info) {
    mux(info).then((url) => {
        return extract(url).then((file) => {
            switch (info.menuItemId) {
                case "send":   return jsonrpc.send(file);
                case "insert": return jsonrpc.insert(file);
                case "add":    return jsonrpc.add(file);
                default: throw new Error(info.menuItemId + " is not supported");
            }
        }).then(() => {
            return browser.storage.local.get(["general-history"]);
        }).then((config) => {
            return config["general-history"] ? browser.history.addUrl({ url })
                                             : Promise.resolve();
        });
    }).catch(notify);
};

/**
 * Crée le client JSON-RPC pour contacter Kodi.
 *
 * @function client
 * @param {object} changes Les paramètres modifiés dans la configuration.
 */
const client = function (changes) {
    if (!("connection-host" in changes)) {
        return;
    }

    jsonrpc = new JSONRPC(changes["connection-host"].newValue);
};

/**
 * Ajoute les options dans les menus contextuels.
 *
 * @function menu
 * @param {object} changes Les paramètres modifiés dans la configuration.
 */
const menu = function (changes) {
    // Ignorer tous les changements sauf ceux liés au menu contextuel.
    if (!Object.keys(changes).some((k) => k.startsWith("menus-") ||
                                          k.startsWith("contexts-"))) {
        return;
    }

    // Vider les options du menu contextuel, puis ajouter les options.
    browser.menus.removeAll().then(function () {
        return browser.storage.local.get();
    }).then(function (config) {
        const contexts = Object.entries(config)
                               .filter(([k]) => k.startsWith("contexts-"))
                               .filter(([, v]) => v)
                               .map(([k]) => k.substring(9));

        // Si au moins deux options doivent être affichées : les regrouper dans
        // une option parente.
        if (config["menus-send"] && config["menus-insert"] ||
                config["menus-send"] && config["menus-add"] ||
                config["menus-insert"] && config["menus-add"]) {
            browser.menus.create({
                "contexts": contexts,
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
                "contexts": contexts,
                "id":       "send",
                "title":    browser.i18n.getMessage("menus_firstSend")
            });
        } else if (config["menus-insert"]) {
            browser.menus.create({
                "contexts": contexts,
                "id":       "insert",
                "title":    browser.i18n.getMessage("menus_firstInsert")
            });
        } else if (config["menus-add"]) {
            browser.menus.create({
                "contexts": contexts,
                "id":       "add",
                "title":    browser.i18n.getMessage("menus_firstAdd")
            });
        }
    });
};

browser.storage.local.get().then(function (config) {
    // Migrer l'ancienne propriété "host" (avant la version 1.0.0).
    if ("host" in config) {
        browser.storage.local.set({ "connection-host": config.host });
        browser.storage.local.remove("host");
    }
    // Renommer la propriété "menus-play" (avant la version 1.5.0).
    if ("menus-play" in config) {
        browser.storage.local.set({ "menus-send": config["menus-play"] });
        browser.storage.local.remove("menus-play");
    }
    // Supprimer les anciennes propriétés.
    browser.storage.local.remove([
        "port", "username", "password", "airmozilla-format", "connection-port",
        "connection-username", "connection-password", "contexts-browser_action",
        "version"
    ]);

    // Définir des valeurs par défaut.
    for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
        if (!(key in config)) {
            browser.storage.local.set({ [key]: value });
        }
    }

    // Se connecter à Kodi et surveiller les futures changements de la
    // configuration.
    client({ "connection-host": { "newValue": config["connection-host"] } });
    browser.storage.onChanged.addListener(client);

    // Ajouter les options dans les menus contextuels et surveiller les futurs
    // changements de la configuration.
    menu({ "menus-send": null });
    browser.storage.onChanged.addListener(menu);
});

browser.menus.onClicked.addListener(cast);
browser.runtime.onMessage.addListener(cast);
