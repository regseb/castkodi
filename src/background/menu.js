/**
 * @module
 */

import { cast } from "../core/index.js";
import { notify } from "../core/tools/notify.js";

/**
 * Met en majuscule la première lettre d'un texte.
 *
 * @param {string} text Le texte avec modifié.
 * @returns {string} Le texte avec sa première lettre en majuscule.
 */
const capitalize = function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Agrège les liens des différents points d'entrée.
 *
 * @param {browser.contextMenus.OnClickData} info Les informations fournies par
 *                                                le menu contextuel.
 * @returns {Promise<string[]>} Une promesse contenant les liens récupérés.
 */
const aggregate = async function (info) {
    if ("bookmarkId" in info) {
        const bookmarks = await browser.bookmarks.get(info.bookmarkId);
        return bookmarks.map((b) => b?.url ?? b.title);
    }

    return [
        info.selectionText,
        info.linkUrl,
        info.srcUrl,
        info.frameUrl,
        info.pageUrl,
    ];
};

/**
 * Exécute l'action sélectionnée dans le menu contextuel.
 *
 * @param {browser.contextMenus.OnClickData} info Les informations fournies par
 *                                                le menu contextuel.
 */
const handleClick = async function (info) {
    if ("send" === info.menuItemId || "insert" === info.menuItemId ||
            "add" === info.menuItemId) {
        try {
            const urls = await aggregate(info);
            await cast(info.menuItemId, urls);
        } catch (err) {
            await notify(err);
        }
    } else if (!info.wasChecked) {
        await browser.storage.local.set({
            "server-active": Number.parseInt(info.menuItemId, 10),
        });
    }
};

/**
 * Ajoute les options dans les menus contextuels.
 *
 * @param {browser.storage.StorageChange} changes Les paramètres modifiés dans
 *                                                la configuration.
 */
const handleChange = async function (changes) {
    // Ignorer tous les changements sauf ceux liés aux menus et aux serveurs.
    if (!Object.entries(changes).some(([k, v]) => k.startsWith("menu-") &&
                                                  "newValue" in v ||
                                                  k.startsWith("server-") &&
                                                  "newValue" in v)) {
        return;
    }

    // Vider les options du menu contextuel, puis ajouter les options.
    await browser.contextMenus.removeAll();
    const config = await browser.storage.local.get();

    const mode     = config["server-mode"];
    const actions  = config["menu-actions"];
    const contexts = config["menu-contexts"];
    if (1 === actions.length && "single" === mode) {
        const key = `menus_first${capitalize(actions[0])}`;
        browser.contextMenus.create({
            contexts,
            id:    actions[0],
            title: browser.i18n.getMessage(key),
        });
    } else if (1 === actions.length && "multi" === mode ||
               2 <= actions.length) {
        browser.contextMenus.create({
            contexts,
            id:    "parent",
            title: browser.i18n.getMessage("menus_firstParent"),
        });
        for (const action of actions) {
            const key = `menus_second${capitalize(action)}`;
            browser.contextMenus.create({
                // Passer les contextes aux enfants car dans Chromium ils ne
                // sont pas hérités du parent.
                contexts,
                id:       action,
                parentId: "parent",
                title:    browser.i18n.getMessage(key),
            });
        }

        if ("multi" === mode) {
            browser.contextMenus.create({
                parentId: "parent",
                type:     "separator",
            });
            for (const [index, server] of config["server-list"].entries()) {
                const name = (/^\s*$/u).test(server.name)
                               ? browser.i18n.getMessage("menus_noName",
                                                         (index + 1).toString())
                               : server.name;
                browser.contextMenus.create({
                    checked:  config["server-active"] === index,
                    id:       index.toString(),
                    parentId: "parent",
                    title:    name,
                    type:     "radio",
                });
            }
        }
    }
};

browser.storage.onChanged.addListener(handleChange);
browser.contextMenus.onClicked.addListener(handleClick);
