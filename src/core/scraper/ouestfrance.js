/**
 * @module
 * @license MIT
 * @see https://www.ouest-france.fr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'une page d'Ouest-France.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     `undefined`.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (url, metadata, context) => {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    for (const iframe of doc.querySelectorAll("iframe[data-ofiframe-src]")) {
        const file = await metaExtract(
            new URL(iframe.dataset.ofiframeSrc, url),
            { ...context, depth: true },
        );
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://www.ouest-france.fr/*");
