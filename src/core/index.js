/**
 * @module
 */

import { jsonrpc }     from "./jsonrpc.js";
import { notify }      from "./notify.js";
import { PebkacError } from "./pebkac.js";
import { extract }     from "./scrapers.js";

/**
 * Récupère le lien à analyser parmi les données récupérées.
 *
 * @function
 * @param {Array.<string>} urls La liste des liens récupérés par le menu
 *                              contextuel.
 * @returns {string|undefined} Le lien à analyser ou <code>undefined</code> si
 *                             aucun lien est valide.
 */
export const mux = function (urls) {
    return urls.filter((u) => undefined !== u)
               .map((u) => u.trim())
               .map((url) => {
        // Si l'URL n'a pas de schéma : ajouter le protocole HTTP.
        return (/^[a-z-]+:/iu).test(url) ? url
                                         : url.replace(/^\/*/u, "http://");
    }).find((url) => {
        try {
            return Boolean(new URL(url)) && (
                   (/^https?:\/\/[^/]+\/.*$/iu).test(url) ||
                   (/^magnet:.*$/iu).test(url) ||
                   (/^acestream:.*$/iu).test(url));
        } catch {
            // Ignorer l'erreur provenant d'une URL invalide.
            return false;
        }
    });
};

/**
 * Diffuse un média sur Kodi.
 *
 * @function
 * @param {string}         action L'action à effectuer (<code>"send"</code>,
 *                                <code>"insert"</code> ou <code>"add"</code>).
 * @param {Array.<string>} urls   La liste des éventuelles URLs.
 * @returns {Promise.<void>} Une promesse tenue ou rejetée.
 */
export const cast = async function (action, urls) {
    const url = mux(urls);
    if (undefined === url) {
        return notify(1 === urls.length ? new PebkacError("noLink", urls[0])
                                        : new PebkacError("noLinks"));
    }


    try {
        const file = await extract(new URL(url), { "depth": 0 });
        switch (action) {
            case "send":   await jsonrpc.send(file);   break;
            case "insert": await jsonrpc.insert(file); break;
            case "add":    await jsonrpc.add(file);    break;
            default: return notify(new Error(action + " is not supported"));
        }
        const config = await browser.storage.local.get(["general-history"]);
        return config["general-history"] ? browser.history.addUrl({ url })
                                         : Promise.resolve();
    } catch (err) {
        return notify(err);
    }
};
