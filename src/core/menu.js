/**
 * @module
 */

import { notify } from "./tools/notify.js";
import { checkHosts } from "./permission.js";
import { cast } from "./index.js";

/**
 * Met en majuscule la première lettre d'un texte.
 *
 * @param {string} text Le texte à modifier.
 * @returns {string} Le texte avec sa première lettre en majuscule.
 */
const capitalize = function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Ajoute les options dans les menus contextuels.
 */
export const update = async function () {
    // Vider les options du menu contextuel, puis ajouter les options.
    await browser.contextMenus.removeAll();

    const config = await browser.storage.local.get();
    const mode     = config["server-mode"];
    const actions  = config["menu-actions"];
    const contexts = config["menu-contexts"];
    if (0 === actions.length || 0 === contexts.length) {
        return;
    }

    if (1 === actions.length && "single" === mode) {
        const key = `menus_first${capitalize(actions[0])}`;
        browser.contextMenus.create({
            contexts,
            id:    actions[0],
            title: browser.i18n.getMessage(key),
        });
    } else {
        browser.contextMenus.create({
            contexts,
            id:    "parent",
            title: browser.i18n.getMessage("menus_firstParent"),
        });
        for (const action of actions) {
            const key = `menus_second${capitalize(action)}`;
            browser.contextMenus.create({
                // Passer les contextes aux enfants car dans Chromium ils ne
                // sont pas hérités du parent (et sans contexte, l'option n'est
                // pas affichée).
                contexts,
                id:       action,
                parentId: "parent",
                title:    browser.i18n.getMessage(key),
            });
        }

        if ("multi" === mode) {
            browser.contextMenus.create({
                // Passer les contextes aux enfants car dans Chromium ils ne
                // sont pas hérités du parent (et sans contexte, l'option n'est
                // pas affichée).
                contexts,
                id:       "separator",
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
                    // Passer les contextes aux enfants car dans Chromium ils ne
                    // sont pas hérités du parent (et sans contexte, l'option
                    // n'est pas affichée).
                    contexts,
                    id:       index.toString(),
                    parentId: "parent",
                    title:    name,
                    type:     "radio",
                });
            }
        }
    }
};

/**
 * Agrège les liens des différents points d'entrée.
 *
 * @param {browser.contextMenus.OnClickData} info Les informations fournies par
 *                                                le menu contextuel.
 * @returns {Promise<string[]>} Une promesse contenant les liens récupérés.
 */
export const aggregate = async function (info) {
    if ("bookmarkId" in info) {
        const bookmarks = await browser.bookmarks.get(info.bookmarkId);
        return bookmarks.map((b) => b.url ?? b.title);
    }

    const config = await browser.storage.local.get(["menu-contexts"]);
    const contexts = config["menu-contexts"];
    return [
        contexts.includes("selection") ? info.selectionText : undefined,
        contexts.includes("link") ? info.linkUrl : undefined,
        "audio" === info.mediaType && contexts.includes("audio") ? info.srcUrl
                                                                 : undefined,
        "video" === info.mediaType && contexts.includes("video") ? info.srcUrl
                                                                 : undefined,
        contexts.includes("frame") ? info.frameUrl : undefined,
        contexts.includes("page") ? info.pageUrl : undefined,
    ].filter((u) => undefined !== u);
};

/**
 * Exécute l'action sélectionnée dans le menu contextuel.
 *
 * @param {browser.contextMenus.OnClickData} info Les informations fournies par
 *                                                le menu contextuel.
 */
export const click = async function (info) {
    try {
        await checkHosts();

        const urls = await aggregate(info);
        await cast(info.menuItemId, urls);
    } catch (err) {
        await notify(err);
    }
};

/**
 * Change le serveur actif.
 *
 * @param {number} server L'index du nouveau serveur actif.
 */
export const change = async function (server) {
    await browser.storage.local.set({ "server-active": server });
};
