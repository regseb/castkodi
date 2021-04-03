/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern }           from "../../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";

/**
 * L'expression rationnelle pour extraire l'URL de la vidéo.
 *
 * @constant {RegExp}
 */
const URL_REGEXP = /url: '(?<url>https:\/\/.*\/manifest.m3u8)'/u;

/**
 * L'expression rationnelle pour extraire l'identifiant de la vidéo YouTube.
 *
 * @constant {RegExp}
 */
const YOUTUBE_REGEXP = /videoId: '(?<videoId>.*)'/u;

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une vidéo de StarGR.
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
    for (const script of doc.querySelectorAll("script:not([src])")) {
        let result = URL_REGEXP.exec(script.text);
        if (null !== result) {
            return result.groups.url;
        }

        result = YOUTUBE_REGEXP.exec(script.text);
        if (null !== result) {
            return metaExtract(new URL(result.groups.videoId,
                                       "https://www.youtube.com/embed/"),
                               { ...options, depth: true });
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://www.star.gr/*");
