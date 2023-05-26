/**
 * @module
 * @license MIT
 * @see https://www.melty.fr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'un article de Melty.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url, metadata, context) {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();
    for (const meta of doc.querySelectorAll('meta[itemprop="contentUrl"]')) {
        const file = await metaExtract(new URL(meta.content, url), {
            ...context,
            depth: true,
        });
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://www.melty.fr/*");
