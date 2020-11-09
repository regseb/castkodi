/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern }           from "../../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'une page de Ouest-France.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>null</code>.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content, options) {
    if (options.depth) {
        return null;
    }
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    for (const iframe of doc.querySelectorAll("iframe[data-ofiframe-src]")) {
        const file = await metaExtract(
            new URL(iframe.dataset.ofiframeSrc, href),
            { ...options, depth: true },
        );
        if (null !== file) {
            return file;
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://www.ouest-france.fr/*");
