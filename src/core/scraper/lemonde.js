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
 * @param {URL}      _url              L'URL d'une page du Monde.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content, options) {
    if (options.depth) {
        return null;
    }

    const doc = await content.html();

    const source = doc.querySelector(`video source[type="video/youtube"]`);
    if (null !== source) {
        return metaExtract(new URL(source.src), { ...options, depth: true });
    }

    const div = doc.querySelector(`div[data-provider="dailymotion"]`);
    if (null !== div) {
        return metaExtract(
            new URL(div.dataset.id, "https://www.dailymotion.com/embed/video/"),
            { ...options, depth: true },
        );
    }

    const blockquote = doc.querySelector("blockquote.tiktok-embed");
    if (null !== blockquote) {
        return metaExtract(new URL(blockquote.cite),
                           { ...options, depth: true });
    }

    return null;
};
export const extract = matchPattern(action, "*://www.lemonde.fr/*");
