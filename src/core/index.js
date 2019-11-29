/**
 * @module
 */

import { jsonrpc }     from "./jsonrpc.js";
import { notify }      from "./notify.js";
import { PebkacError } from "./pebkac.js";
import { scrapers }    from "./scrapers.js";

/**
 * Récupère le lien à analyser parmi les données récupérées.
 *
 * @function mux
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
 * Appelle le bon scraper selon l'URL d'une page Internet.
 *
 * @function dispatch
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code> si aucun
 *                              scraper ne gère cette URL.
 */
export const dispatch = async function (url) {
    for (const scraper of scrapers.filter((s) => s.pattern.test(url))) {
        const file = await scraper.action(new URL(url));
        if (null !== file) {
            return file;
        }
    }
    return null;
};

/**
 * Fouille la page (si c'est du HTML) pour en extraire des éléments
 * <code>iframe</code>.
 *
 * @function rummage
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou le lien de la page Internet
 *                             si aucun élément n'est présent.
 */
export const rummage = async function (url) {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");
    // Si ce n'est pas une page HTML : retourner le lien d'origine.
    if (null === contentType ||
            !contentType.startsWith("text/html") &&
            !contentType.startsWith("application/xhtml+xml")) {
        return url;
    }

    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    for (const element of doc.querySelectorAll("iframe[src]")) {
        const file = await dispatch(new URL(element.getAttribute("src"),
                                            url).href);
        if (null !== file) {
            return file;
        }
    }
    // Si aucun fichier n'a été trouvé : retourner le lien d'origine.
    return url;
};

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @function extract
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
export const extract = async function (url) {
    const file = await dispatch(url);
    return null === file ? rummage(url)
                         : file;
};

/**
 * Diffuse un média sur Kodi.
 *
 * @function cast
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
        const file = await extract(url);
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
