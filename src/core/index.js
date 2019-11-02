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
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code> si aucun scraper ne gère cette URL.
 */
export const dispatch = function (url) {
    return scrapers.filter((s) => s.pattern.test(url))
                   .reduce((result, scraper) => {
        return result.then((file) => {
            // Si aucun fichier n'a encore été trouvé : continuer d'analyser
            // avec les autres scrapers.
            return null === file ? scraper.action(new URL(url))
                                 : file;
        });
    }, Promise.resolve(null));
};

/**
 * Fouille la page (si c'est du HTML) pour en extraire des éléments
 * <code>iframe</code>.
 *
 * @function rummage
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    l'URL de la page Internet si aucun élément n'est présent.
 */
export const rummage = function (url) {
    return fetch(url).then((response) => {
        const contentType = response.headers.get("Content-Type");
        if (null !== contentType &&
                (contentType.startsWith("text/html") ||
                 contentType.startsWith("application/xhtml+xml"))) {
            return response.text();
        }
        // Si ce n'est pas une page HTML : simuler une page vide.
        return "";
    }).then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        return [...doc.querySelectorAll("iframe[src]")]
                                                  .reduce((result, element) => {
            return result.then((file) => {
                // Si aucun fichier n'a encore été trouvé : continuer d'analyser
                // les iframes de la page.
                return null === file
                      ? dispatch(new URL(element.getAttribute("src"), url).href)
                      : file;
            });
        }, Promise.resolve(null)).then((file) => {
            // Si aucun fichier n'a été trouvé : retourner le lien d'origine.
            return null === file ? url
                                 : file;
        });
    });
};

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @function extract
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em>.
 */
export const extract = function (url) {
    return dispatch(url).then((file) => {
        return null === file ? rummage(url)
                             : file;
    });
};

/**
 * Diffuse un média sur Kodi.
 *
 * @function cast
 * @param {string}         action L'action à effectuer (<code>"send"</code>,
 *                                <code>"insert"</code> ou <code>"add"</code>).
 * @param {Array.<string>} urls   La liste des éventuelles URLs.
 * @returns {Promise} Une promesse tenue ou rejetée.
 */
export const cast = function (action, urls) {
    const url = mux(urls);
    if (undefined === url) {
        return notify(1 === urls.length ? new PebkacError("noLink", urls[0])
                                        : new PebkacError("noLinks"));
    }

    return extract(url).then((file) => {
        switch (action) {
            case "send":   return jsonrpc.send(file);
            case "insert": return jsonrpc.insert(file);
            case "add":    return jsonrpc.add(file);
            default: throw new Error(action + " is not supported");
        }
    }).then(() => {
        return browser.storage.local.get(["general-history"]);
    }).then((config) => {
        return config["general-history"] ? browser.history.addUrl({ url })
                                         : Promise.resolve();
    }).catch(notify);
};
