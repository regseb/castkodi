/**
 * @module
 * @license MIT
 * @see https://www.facebook.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Cherche récursivement une propriété dans un objet.
 *
 * @param {any} obj   La variable à parcourir.
 * @param {any} props Les propriétés à chercher.
 * @returns {any|undefined} La valeur trouvée ; ou `undefined` si les propriétés
 *                          ne sont pas dans l'objet.
 */
const find = (obj, props) => {
    if (null === obj) {
        return undefined;
    }
    if ("object" === typeof obj) {
        for (const prop of props) {
            if (prop in obj && null !== obj[prop]) {
                return obj[prop];
            }
        }
        for (const item of Object.values(obj)) {
            const value = find(item, props);
            if (undefined !== value) {
                return value;
            }
        }
    } else if (Array.isArray(obj)) {
        for (const item of obj) {
            const value = find(item, props);
            if (undefined !== value) {
                return value;
            }
        }
    }
    return undefined;
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo de Facebook.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    // Définir l'entête "Accept", car par défaut : fetch() utilise "*/*" et
    // Facebook ne retourne pas l'URL de la vidéo.
    const doc = await metadata.html({ headers: { Accept: "text/html" } });
    for (const script of doc.querySelectorAll(
        'script[type="application/json"][data-sjs]',
    )) {
        // Ne pas aller directement récupérer les propriétés
        // "browser_native_*_url", car le chemin est trop complexe.
        const url = find(JSON.parse(script.text), [
            "browser_native_hd_url",
            "browser_native_sd_url",
        ]);
        if (undefined !== url) {
            return url;
        }
    }
    return undefined;
};
export const extract = matchURLPattern(
    action,
    "https://www.facebook.com/watch/*",
    "https://www.facebook.com/*/videos/*",
    "https://m.facebook.com/*/videos/*",
    "https://www.facebook.com/reel/*",
    "https://fb.watch/*",
);
