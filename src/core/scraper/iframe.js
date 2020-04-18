/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern }           from "../../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";

/**
 * Fouille les éléments <code>iframe</code> de la page.
 *
 * @param {URL}      url               L'URL d'une page quelconque.
 * @param {object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>null</code>.
 * @param {object}   options           Les options de l'extraction.
 * @param {number}   options.depth     Le niveau de profondeur de l'extraction.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content, options) {
    if (0 < options.depth) {
        return null;
    }
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    for (const iframe of doc.querySelectorAll("iframe[src]")) {
        const file = await metaExtract(
            new URL(iframe.getAttribute("src"), href),
            { ...options, depth: options.depth + 1 },
        );
        if (null !== file) {
            return file;
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://*/*");
