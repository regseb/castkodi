/**
 * @module
 */
/* eslint-disable require-await */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'une vidéo Futura Sciences.
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
const action = async function ({ href }, content, options) {
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    const urls = [];
    for (const iframe of doc.querySelectorAll("iframe[data-src]")) {
        urls.push(iframe.dataset.src);
    }
    for (const div of doc.querySelectorAll("div.vsly-player[data-iframe]")) {
        urls.push(div.dataset.iframe);
    }

    for (const url of urls) {
        const file = await metaExtract(new URL(url, href),
                                       { ...options, depth: true });
        if (null !== file) {
            return file;
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://www.futura-sciences.com/*");
