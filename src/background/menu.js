/**
 * @module
 */

import { cast }   from "../core/index.js";

/**
 * Agrège les liens des différents points d'entrée.
 *
 * @function aggregate
 * @param {object} info Les informations fournies par le menu contextuel.
 * @returns {Promise} Une promesse contenant les liens récupérés.
 */
const aggregate = function (info) {
    if ("bookmarkId" in info) {
        return browser.bookmarks.get(info.bookmarkId).then(([bookmark]) => {
            return ["url" in bookmark ? bookmark.url
                                      : ""];
        });
    }

    return Promise.resolve([
        info.selectionText, info.linkUrl, info.srcUrl, info.frameUrl,
        info.pageUrl
    ]);
};

/**
 * Exécute l'action sélectionnée dans le menu contextuel.
 *
 * @param {object} info Les informations fournies par le menu contextuel.
 */
const click = function (info) {
    if ("send" === info.menuItemId || "insert" === info.menuItemId ||
            "add" === info.menuItemId) {
        aggregate(info).then((urls) => cast(info.menuItemId, urls));
    } else if (!info.wasChecked) {
        browser.storage.local.set({
            "server-active": parseInt(info.menuItemId, 10)
        });
    }
};

/**
 * Ajoute les options dans les menus contextuels.
 *
 * @function menu
 * @param {object} changes Les paramètres modifiés dans la configuration.
 */
const menu = function (changes) {
    // Ignorer tous les changements sauf ceux liés aux menus.
    if (!Object.entries(changes).some(([k, v]) => k.startsWith("menu-") &&
                                                  "newValue" in v ||
                                                  k.startsWith("server-") &&
                                                  "newValue" in v)) {
        return;
    }

    // Vider les options du menu contextuel, puis ajouter les options.
    browser.menus.removeAll().then(() => browser.storage.local.get())
                             .then((config) => {
        const mode     = config["server-mode"];
        const actions  = config["menu-actions"];
        const contexts = config["menu-contexts"];
        if (1 === actions.length && "single" === mode) {
            const key = "menus_first" + actions[0].charAt(0).toUpperCase() +
                        actions[0].substring(1);
            browser.menus.create({
                "contexts": contexts,
                "id":       actions[0],
                "title":    browser.i18n.getMessage(key)
            });
        } else if (1 === actions.length && "multi" === mode ||
                   2 <= actions.length) {
            browser.menus.create({
                "contexts": contexts,
                "id":       "parent",
                "title":    browser.i18n.getMessage("menus_firstParent")
            });
            for (const action of actions) {
                const key = "menus_second" + action.charAt(0).toUpperCase() +
                            action.substring(1);
                browser.menus.create({
                    "id":       action,
                    "parentId": "parent",
                    "title":    browser.i18n.getMessage(key)
                });
            }

            if ("multi" === mode) {
                browser.menus.create({
                    "parentId": "parent",
                    "type":     "separator"
                });
                config["server-list"].forEach((server, index) => {
                    const name = (/^\s*$/u).test(server.name)
                            ? browser.i18n.getMessage("menus_noName", index + 1)
                            : server.name;
                    browser.menus.create({
                        "checked":  config["server-active"] === index,
                        "id":       index.toString(),
                        "parentId": "parent",
                        "title":    name,
                        "type":     "radio"
                    });
                });
            }
        }
    });
};

browser.storage.onChanged.addListener(menu);
browser.menus.onClicked.addListener(click);
