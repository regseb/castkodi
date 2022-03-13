/**
 * @module
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire l'URL de la vidéo.
 *
 * @type {RegExp}
 */
const URL_REGEXP = /url: '(?<url>https:\/\/.*\/manifest.m3u8)'/u;

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une vidéo de StarGR.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionTv = async function (_url, content) {
    const doc = await content.html();
    const div = doc.querySelector("div[data-plugin-bitmovinv5]");
    if (null === div) {
        return null;
    }

    const json = JSON.parse(div.dataset.pluginBitmovinv5);
    return json.BitMovin.ConfigUrl;
};
export const extractTv = matchPattern(actionTv, "*://www.star.gr/tv/*");

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
const actionVideo = async function (_url, content, options) {
    const doc = await content.html();

    // Ne pas utiliser le scraper iframe car il est exécuté trop tard.
    // La page contient des microdonnées sur la vidéo, mais c'est l'URL de
    // l'image qui est renseignée dans le champ de l'URL de la vidéo. Le scraper
    // iframe étant exécuté après celui sur le ldjson, il faut gérer l'iframe
    // avant le scraper ldjson.
    const iframe = doc.querySelector("iframe#yt-player");
    if (null !== iframe) {
        return metaExtract(new URL(iframe.src), { ...options, depth: true });
    }

    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = URL_REGEXP.exec(script.text);
        if (null !== result) {
            return result.groups.url;
        }
    }
    return null;
};
export const extractVideo = matchPattern(actionVideo,
    "*://www.star.gr/video/*");
