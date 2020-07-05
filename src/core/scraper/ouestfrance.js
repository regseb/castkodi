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
 * @param {object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>null</code>.
 * @param {object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content, options) {
    if (options.depth) {
        return null;
    }
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    const iframe = doc.querySelector("iframe[data-ofiframe-src]");
    if (null === iframe) {
        return null;
    }
    return metaExtract(new URL(iframe.dataset.ofiframeSrc, href),
                       { ...options, depth: true });
};
export const extract = matchPattern(action, "*://www.ouest-france.fr/*");
