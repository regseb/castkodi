/**
 * @module
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/youtube.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire l'URL de la vidéo.
 *
 * @type {RegExp}
 */
const URL_REGEXP = /url: '(?<url>https:\/\/.*\/manifest.m3u8)'/u;

/**
 * L'expression rationnelle pour extraire l'identifiant de la vidéo YouTube.
 *
 * @type {RegExp}
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
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content, { incognito }) {
    const doc = await content.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        let result = URL_REGEXP.exec(script.text);
        if (null !== result) {
            return result.groups.url;
        }

        result = YOUTUBE_REGEXP.exec(script.text);
        if (null !== result) {
            return plugin.generateVideoUrl(result.groups.videoId, incognito);
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://www.star.gr/*");
