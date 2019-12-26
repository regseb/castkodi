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
 * @param {URL}          url     L'URL d'une page quelconque.
 * @param {HTMLDocument} doc     Le contenu HTML de la page.
 * @param {object}       options Les options de l'extraction.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, doc, options) {
    if (null === doc || 0 < options.depth) {
        return null;
    }

    for (const iframe of doc.querySelectorAll("iframe[src]")) {
        const file = await metaExtract(
            new URL(iframe.getAttribute("src"), href),
            { ...options, "depth": options.depth + 1 }
        );
        if (null !== file) {
            return file;
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://*/*");
