/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { cacheable } from "../tools/cacheable.js";
import { matchPattern } from "../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as iframeExtract } from "./iframe.js";
import { extract as ldjsonExtract } from "./ldjson.js";
import { extract as mediaExtract } from "./media.js";

/**
 * La liste des extracteurs génériques.
 *
 * @type {Function[]}
 */
const GENERIC_EXTRACTS = [mediaExtract, ldjsonExtract, iframeExtract];

/**
 * Fouiller dans les éléments <code>noscript</code> de la page.
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

    for (const noscript of doc.querySelectorAll("noscript")) {
        const subcontent = {
            html: cacheable(() => {
                return Promise.resolve(
                    new DOMParser().parseFromString(
                        noscript.innerHTML,
                        "text/html",
                    ),
                );
            }),
        };
        for (const genericExtract of GENERIC_EXTRACTS) {
            const file = await genericExtract(url, subcontent, options);
            if (undefined !== file) {
                return file;
            }
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://*/*");
