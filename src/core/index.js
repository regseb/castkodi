/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { kodi } from "./jsonrpc/kodi.js";
import { extract } from "./scrapers.js";
import { PebkacError } from "./tools/pebkac.js";

/**
 * Récupère le lien à analyser parmi les données récupérées.
 *
 * @param {string[]} urls La liste des liens récupérés par le menu contextuel ou
 *                        dans la zone de saisie de la popup.
 * @returns {string|undefined} Le lien à analyser ou `undefined` si aucun lien
 *                             n'est valide.
 */
export const mux = (urls) => {
    return urls
        .map((u) => u.trim())
        .map((url) => {
            // Si l'URL n'a pas de schéma : ajouter le protocole HTTP.
            return /^[-a-z]+:/iu.test(url)
                ? url
                : url.replace(/^\/*/u, "http://");
        })
        .find((url) => {
            // Vérifier que l'URL est valide et qu'elle utilise un schéma géré.
            return (
                URL.canParse(url) &&
                (/^https?:\/\//iu.test(url) ||
                    /^magnet:/iu.test(url) ||
                    /^acestream:/iu.test(url) ||
                    /^plugin:/iu.test(url))
            );
        });
};

/**
 * Diffuse un média sur Kodi.
 *
 * @param {string}   action L'action à effectuer (`"send"`, `"insert"` ou
 *                          `"add"`).
 * @param {string[]} urls   La liste des éventuelles URLs.
 * @returns {Promise<void>} Une promesse tenue vide.
 */
export const cast = async (action, urls) => {
    const url = mux(urls);
    if (undefined === url) {
        throw 1 === urls.length
            ? new PebkacError("noLink", urls[0])
            : new PebkacError("noLinks");
    }

    const file =
        (await extract(new URL(url), {
            depth: false,
            incognito: browser.extension.inIncognitoContext,
        })) ?? url;
    if ("send" === action) {
        // Vider la liste de lecture, ajouter le nouveau média et lancer la
        // lecture.
        await kodi.playlist.clear();
        await kodi.playlist.add(file);
        await kodi.player.open();
    } else if ("insert" === action) {
        const position = await kodi.player.getProperty("position");
        // Si aucun média n'est en cours de lecture : le nouveau média sera
        // placé en première position.
        await kodi.playlist.insert(file, position + 1);
    } else if ("add" === action) {
        await kodi.playlist.add(file);
    } else {
        throw new Error(`${action} is not supported`);
    }

    if (!browser.extension.inIncognitoContext) {
        const config = await browser.storage.local.get(["general-history"]);
        if (config["general-history"]) {
            await browser.history.addUrl({ url });
        }
    }
};
