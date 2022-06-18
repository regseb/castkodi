/**
 * @module
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL d'une vidéo du Point.
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
const action = async function (url, content, options) {
    if (options.depth) {
        return undefined;
    }
    const doc = await content.html();
    const div = doc.querySelector("div[data-video-src]");
    if (null !== div) {
        return metaExtract(new URL(div.dataset.videoSrc),
                           { ...options, depth: true });
    }

    // Ne pas utiliser le scraper iframe car il est exécuté trop tard.
    // La page contient des microdonnées sur la vidéo, mais c'est l'URL de la
    // page embarquée de Dailymotion qui est renseignée dans le champ de l'URL
    // de la vidéo. Le scraper iframe étant exécuté après celui sur le ldjson,
    // il faut gérer l'iframe avant le scraper ldjson.
    for (const iframe of doc.querySelectorAll("iframe[src]")) {
        const file = await metaExtract(new URL(iframe.getAttribute("src"), url),
                                      { ...options, depth: true });
        if (undefined !== file) {
            return file;
        }
    }

    return undefined;
};
export const extract = matchPattern(action, "https://www.lepoint.fr/*");
