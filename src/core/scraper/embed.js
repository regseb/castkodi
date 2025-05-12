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
 * Fouille les éléments `embed` de la page.
 *
 * @param {URL}      url               L'URL d'une page quelconque.
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
    const doc = await metadata.html();
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

        if (!context.depth) {
            const file = await metaExtract(
                new URL(embed.getAttribute("src"), url),
                { ...context, depth: true },
            );
            if (undefined !== file) {
                return file;
            }
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://*/*");
