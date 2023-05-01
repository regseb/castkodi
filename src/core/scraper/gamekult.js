/**
 * @module
 * @license MIT
 * @see https://www.gamekult.com/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page de Gamekult.
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
    const video = doc.querySelector(".js-dailymotion-video[data-id]");
    return null === video
        ? undefined
        : metaExtract(
              new URL(
                  `https://www.dailymotion.com/embed/video/${video.dataset.id}`,
              ),
              { ...options, depth: true },
          );
};
export const extract = matchPattern(
    action,
    "*://www.gamekult.com/*",
    "*://gamekult.com/*",
);
