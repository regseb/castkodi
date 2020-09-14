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
 * @param {URL}      _url              L'URL d'une vidéo du Point.
 * @param {object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant
 *                                     le document HTML.
 * @param {object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content, options) {
    if (options.depth) {
        return null;
    }
    const doc = await content.html();
    const div = doc.querySelector("div[data-video-src]");
    if (null === div) {
        return null;
    }

    return metaExtract(new URL(div.dataset.videoSrc),
                       { ...options, depth: true });
};
export const extract = matchPattern(action, "https://www.lepoint.fr/*");
