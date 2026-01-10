/**
 * @module
 * @license MIT
 * @see https://invidious.io/
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
 * @param {URLMatch} _url              L'URL d'une éventuelle vidéo Invidious.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     `undefined`.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://github.com/iv-org/invidious/blob/v2.20250913.0/src/invidious/views/watch.ecr#L29
 */
const action = async (_url, metadata, context) => {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const link = doc.querySelector(
        'link[rel="alternate"][href^="https://www.youtube.com/watch?v="]',
    );
    if (null === link) {
        return undefined;
    }
    return await metaExtract(new URL(link.href), { ...context, depth: true });
};
export const extract = matchURLPattern(action, "*://*/*");
