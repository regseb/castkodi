/**
 * @module
 */

import { PebkacError } from "./pebkac.js";
import { scrapers }    from "./scrapers.js";

/**
 * Agrège les données des différents points d'entrée.
 *
 * @function aggregate
 * @param {object} info Les informations fournies par le menu contextuel ou la
 *                      pop-up.
 * @returns {Promise} Une promesse contenant les données récupérées.
 */
const aggregate = function (info) {
    if ("bookmarkId" in info) {
        return browser.bookmarks.get(info.bookmarkId).then(([bookmark]) => {
            if ("url" in bookmark) {
                return [bookmark.url];
            }
            throw new PebkacError("noLink");
        });
    }

    return Promise.resolve([
        info.selectionText, info.linkUrl, info.srcUrl, info.frameUrl,
        info.pageUrl, info.popupUrl
    ]);
};

/**
 * Récupère l'URL à analyser parmi les données récupérées.
 *
 * @function mux
 * @param {object} info Les informations fournies par le menu contextuel ou la
 *                      pop-up.
 * @returns {Promise} Une promesse contenant le lien à analyser.
 */
export const mux = function (info) {
    return aggregate(info).then((urls) => {
        const result = urls.filter((u) => undefined !== u)
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
        if (undefined === result) {
            throw new PebkacError("noLink");
        }
        return result;
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
const dispatch = function (url) {
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
const rummage = function (url) {
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

        return Array.from(doc.querySelectorAll("iframe[src]"))
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
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
export const extract = function (url) {
    return dispatch(url).then((file) => {
        return null === file ? rummage(url)
                             : file;
    });
};
