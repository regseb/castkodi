"use strict";

require.config({
    "baseUrl": "core"
});

/**
 * @module background
 */
require(["notify", "scrapers", "jsonrpc"],
        function (notify, scrapers, jsonrpc) {

    /**
     * La liste des options qui seront ajoutées dans le menu contextuel pour :
     * <ul>
     *   <li>les éléments audio et les vidéos ;</li>
     *   <li>les liens ;</li>
     *   <li>le bouton de l'extension, les <code>iframe</code>, la page et
     *        l'onglet ;</li>
     *   <li>les textes sélectionnés.</li>
     * </ul>
     *
     * @constant {Object.<string, Object>} KINDS
     */
    const KINDS = {
        "media": {
            "contexts":          ["audio", "video"],
            "targetUrlPatterns": ["*://*/*"]
        },
        "link": {
            "contexts":          ["link"],
            "targetUrlPatterns": scrapers.patterns
        },
        "document": {
            "contexts":            ["browser_action", "frame", "page", "tab"],
            "documentUrlPatterns": scrapers.patterns
        },
        "selection": {
            "contexts": ["selection"]
        }
    };

    /**
     * Diffuse un média sur Kodi.
     *
     * @function cast
     * @param {Object} info Les informations fournies par le menu contextuel ou
     *                      la popup.
     * @return {Promise} Une promesse se réalisant directement (pour fermer la
     *                   popup).
     */
    const cast = function (info) {
        const urls = [info.selectionText, info.linkUrl, info.srcUrl,
                      info.frameUrl, info.pageUrl, info.popupUrl];
        const url = urls.find((u) => undefined !== u && "" !== u);
        scrapers.extract(url).then(function (file) {
            const action = info.menuItemId.split("_")[0];
            switch (action) {
                case "send":   return jsonrpc.send(file);
                case "insert": return jsonrpc.insert(file);
                case "add":    return jsonrpc.add(file);
                default: throw new Error(action + " is not supported");
            }
        }).then(function () {
            return browser.storage.local.get(["general-history"]);
        }).then(function (config) {
            if (config["general-history"]) {
                return browser.history.addUrl({ "url": url.toString() });
            }
            return null;
        }).catch(notify);
        return Promise.resolve(true);
    };

    /**
     * Ajoute les options dans les menus contextuels.
     *
     * @function menu
     * @param {Object} changes Les paramètres de la configuration modifiés.
     */
    const menu = function (changes) {
        // Ignorer tous les paramètres sauf ceux liés au menu contextuel.
        if (!("menus-send" in changes) && !("menus-insert" in changes) &&
                !("menus-add" in changes)) {
            return;
        }
        browser.storage.local.get().then(function (config) {
            // Vider les options du menu contextuel, puis ajouter les options.
            return browser.menus.removeAll().then(function () {
                if (config["menus-send"] && config["menus-insert"] ||
                        config["menus-send"] && config["menus-add"] ||
                        config["menus-insert"] && config["menus-add"]) {
                    for (const [key, kind] of Object.entries(KINDS)) {
                        browser.menus.create(Object.assign({}, kind, {
                            "id":    "parent_" + key,
                            "title": browser.i18n.getMessage(
                                                           "menus_first-parent")
                        }));
                        if (config["menus-send"]) {
                            browser.menus.create({
                                "id":       "send_" + key,
                                "parentId": "parent_" + key,
                                "title":    browser.i18n.getMessage(
                                                            "menus_second-send")
                            });
                        }
                        if (config["menus-insert"]) {
                            browser.menus.create({
                                "id":       "insert_" + key,
                                "parentId": "parent_" + key,
                                "title":    browser.i18n.getMessage(
                                                          "menus_second-insert")
                            });
                        }
                        if (config["menus-add"]) {
                            browser.menus.create({
                                "id":       "add_" + key,
                                "parentId": "parent_" + key,
                                "title":    browser.i18n.getMessage(
                                                             "menus_second-add")
                            });
                        }
                    }
                } else if (config["menus-send"]) {
                    for (const [key, kind] of Object.entries(KINDS)) {
                        browser.menus.create(Object.assign({}, kind, {
                            "id":    "send_" + key,
                            "title": browser.i18n.getMessage("menus_first-send")
                        }));
                    }
                } else if (config["menus-insert"]) {
                    for (const [key, kind] of Object.entries(KINDS)) {
                        browser.menus.create(Object.assign({}, kind, {
                            "id":    "insert_" + key,
                            "title": browser.i18n.getMessage(
                                                           "menus_first-insert")
                        }));
                    }
                } else if (config["menus-add"]) {
                    for (const [key, kind] of Object.entries(KINDS)) {
                        browser.menus.create(Object.assign({}, kind, {
                            "id":    "add_" + key,
                            "title": browser.i18n.getMessage("menus_first-add")
                        }));
                    }
                }

                if (!browser.menus.onClicked.hasListener(cast)) {
                    browser.menus.onClicked.addListener(cast);
                }
            });
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
        // Migrer la propriété "menus-play" (avant la version 1.5.0).
        if ("menus-play" in config) {
            browser.storage.local.set({ "menus-send": config["menus-play"] });
            browser.storage.local.remove("menus-play");
        }

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
        if (!("airmozilla-format" in config)) {
            browser.storage.local.set({ "airmozilla-format": "hd_webm" });
        }

        // Ajouter les options dans les menus contextuels et surveiller les
        // futurs changements de la configuration.
        menu({ "menus-send": null, "menu-insert": null, "menus-add": null });
        browser.storage.onChanged.addListener(menu);
    });

    browser.runtime.onMessage.addListener(cast);
});
