/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'un article de Melty.
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
    if (options.depth) {
        return undefined;
    }

    const doc = await content.html();
    for (const meta of doc.querySelectorAll('meta[itemprop="contentUrl"]')) {
        const file = await metaExtract(new URL(meta.content, url), {
            ...options,
            depth: true,
        });
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://www.melty.fr/*");
