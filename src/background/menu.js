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
const aggregate = async function (info) {
    if ("bookmarkId" in info) {
        const bookmark = await browser.bookmarks.get(info.bookmarkId);
        return ["url" in bookmark[0] ? bookmark[0].url
                                     : ""];
    }

    return [
        info.selectionText, info.linkUrl, info.srcUrl, info.frameUrl,
        info.pageUrl
    ];
};

/**
 * Exécute l'action sélectionnée dans le menu contextuel.
 *
 * @param {object} info Les informations fournies par le menu contextuel.
 */
const click = async function (info) {
    if ("send" === info.menuItemId || "insert" === info.menuItemId ||
            "add" === info.menuItemId) {
        const urls = await aggregate(info);
        cast(info.menuItemId, urls);
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
const menu = async function (changes) {
    // Ignorer tous les changements sauf ceux liés aux menus.
    if (!Object.entries(changes).some(([k, v]) => k.startsWith("menu-") &&
                                                  "newValue" in v ||
                                                  k.startsWith("server-") &&
                                                  "newValue" in v)) {
        return;
    }

    // Vider les options du menu contextuel, puis ajouter les options.
    await browser.menus.removeAll();
    const config = await browser.storage.local.get();

    const mode     = config["server-mode"];
    const actions  = config["menu-actions"];
    const contexts = config["menu-contexts"];
    if (1 === actions.length && "single" === mode) {
        const key = "menus_first" + actions[0].charAt(0).toUpperCase() +
                    actions[0].slice(1);
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
                        action.slice(1);
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
};

browser.storage.onChanged.addListener(menu);
browser.menus.onClicked.addListener(click);
