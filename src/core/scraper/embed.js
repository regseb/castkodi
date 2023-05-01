/**
 * @module
 * @license MIT
 * @see https://developer.mozilla.org/Web/HTML/Element/embed
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Fouille les éléments <code>embed</code> de la page.
 *
 * @param {URL}      url               L'URL d'une page quelconque.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>undefined</code>.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url, content, options) {
    const doc = await content.html();
    if (undefined === doc) {
        return undefined;
    }

    const selector = 'embed[src]:not([src=""]):not([src^="blob:"])';
    for (const embed of doc.querySelectorAll(selector)) {
        if (
            embed.type.startsWith("video/") ||
            embed.type.startsWith("audio/")
        ) {
            return new URL(embed.getAttribute("src"), url).href;
        }

        if (!options.depth) {
            const file = await metaExtract(
                new URL(embed.getAttribute("src"), url),
                { ...options, depth: true },
            );
            if (undefined !== file) {
                return file;
            }
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://*/*");
