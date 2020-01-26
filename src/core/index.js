/**
 * @module
 */

import { JSONRPC }     from "./jsonrpc.js";
import { PebkacError } from "./pebkac.js";
import { extract }     from "./scrapers.js";

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {object}
 */
export const jsonrpc = new JSONRPC("");

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
            // Indiquer que la construction de l'URL a échouée.
            return false;
        }
    });
};

/**
 * Crée le client JSON-RPC pour contacter Kodi.
 *
 * @param {object} changes Les paramètres modifiés dans la configuration.
 */
const change = async function (changes) {
    // Ignorer tous les changements sauf ceux liés au serveur.
    if (!Object.entries(changes).some(([k, v]) => k.startsWith("server-") &&
                                                  "newValue" in v)) {
        return;
    }

    const config = await browser.storage.local.get();
    jsonrpc.close();
    jsonrpc.host = config["server-list"][config["server-active"]].host;
    jsonrpc.onChanged();
};

/**
 * Diffuse un média sur Kodi.
 *
 * @function
 * @param {string}         action L'action à effectuer (<code>"send"</code>,
 *                                <code>"insert"</code> ou <code>"add"</code>).
 * @param {Array.<string>} urls   La liste des éventuelles URLs.
 * @returns {Promise.<void>} Une promesse tenue vide.
 */
export const cast = async function (action, urls) {
    const url = mux(urls);
    if (undefined === url) {
        throw 1 === urls.length ? new PebkacError("noLink", urls[0])
                                : new PebkacError("noLinks");
    }


    const file = await extract(new URL(url), {
        "depth":     0,
        "incognito": browser.extension.inIncognitoContext
    });
    switch (action) {
        case "send":   await jsonrpc.send(file);   break;
        case "insert": await jsonrpc.insert(file); break;
        case "add":    await jsonrpc.add(file);    break;
        default: throw new Error(action + " is not supported");
    }

    if (!browser.extension.inIncognitoContext) {
        const config = await browser.storage.local.get(["general-history"]);
        if (config["general-history"]) {
            await browser.history.addUrl({ url });
        }
    }
};

// Simuler un changement de configuration pour se connecter au bon serveur. Ce
// bidouillage est utile quand ce fichier est chargé depuis les options ou la
// popin (dans le background, cette migration qui change la configuration).
change({ "server-": { "newValue": null } });
browser.storage.onChanged.addListener(change);
