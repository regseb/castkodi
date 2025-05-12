/**
 * @module
 * @license MIT
 * @see https://www.star.gr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo de StarGR.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionTv = async (_url, metadata) => {
    const doc = await metadata.html();
    const div = doc.querySelector("div[data-plugin-bitmovinv5]");
    if (null === div) {
        return undefined;
    }

    const json = JSON.parse(div.dataset.pluginBitmovinv5);
    return json.BitMovin.ConfigUrl;
};
export const extractTv = matchPattern(actionTv, "*://www.star.gr/tv/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une vidéo de StarGR.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionVideo = async (_url, metadata, context) => {
    const doc = await metadata.html();

    // Ne pas utiliser le scraper iframe, car il est exécuté trop tard.
    // La page contient des microdonnées sur la vidéo, mais c'est l'URL de
    // l'image qui est renseignée dans le champ de l'URL de la vidéo. Le scraper
    // iframe étant exécuté après celui sur le ldjson, il faut gérer l'iframe
    // avant le scraper ldjson.
    const iframe = doc.querySelector("iframe#yt-player");
    if (null !== iframe && !context.depth) {
        return await metaExtract(new URL(iframe.src), {
            ...context,
            depth: true,
        });
    }

    return undefined;
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://www.star.gr/video/*",
);
