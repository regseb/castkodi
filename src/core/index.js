/**
 * @module
 */

import { PebkacError } from "./pebkac.js";

/**
 * Agrège les données des différents points d'entrée.
 *
 * @function aggregate
 * @param {object} info Les informations fournies par le menu contextuel ou la
 *                      pop-up.
 * @returns {Promise} Les données récupérées.
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
 * @returns {Promise} L'URL à analyser.
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
