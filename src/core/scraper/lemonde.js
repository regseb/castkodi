/**
 * @module
 */

import * as plugin from "../plugin/dailymotion.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page du Monde.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content, options) {
    if (options.depth) {
        return undefined;
    }

    const doc = await content.html();

    const source = doc.querySelector(`video source[type="video/youtube"]`);
    if (null !== source) {
        return metaExtract(new URL(source.src), { ...options, depth: true });
    }

    const div = doc.querySelector(`div[data-provider="dailymotion"]`);
    if (null !== div) {
        return plugin.generateUrl(div.dataset.id);
    }

    const blockquote = doc.querySelector("blockquote.tiktok-embed");
    if (null !== blockquote) {
        return metaExtract(new URL(blockquote.cite),
                           { ...options, depth: true });
    }

    return undefined;
};
export const extract = matchPattern(action, "*://www.lemonde.fr/*");
