/**
 * @module
 * @license MIT
 * @see https://ok.ru/video
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une page d'OK.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    const div = doc.querySelector("*[data-options]");
    if (null === div) {
        return undefined;
    }

    const json = JSON.parse(div.dataset.options);
    const data = JSON.parse(json.flashvars.metadata);
    return data.hlsManifestUrl;
};
export const extract = matchURLPattern(action, "https://ok.ru/video/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url               L'URL d'une page mobile d'OK.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     `undefined`.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionMobile = async ({ href }, _metadata, context) => {
    // Ne pas utiliser l'attribut "data-options" de la page mobile, car il ne
    // fournit pas le format HLS de la vidéo.
    return await metaExtract(
        new URL(href.replace("//m.ok.ru/", "//ok.ru/")),
        context,
    );
};
export const extractMobile = matchURLPattern(
    actionMobile,
    "https://m.ok.ru/video/*",
);
