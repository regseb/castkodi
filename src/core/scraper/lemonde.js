/**
 * @module
 * @license MIT
 * @see https://www.lemonde.fr/
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
 * @param {URLMatch} _url              L'URL d'une page du Monde.
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
const action = async (_url, metadata, context) => {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();

    const source = doc.querySelector('video source[type="video/youtube"]');
    if (null !== source) {
        return await metaExtract(new URL(source.src), {
            ...context,
            depth: true,
        });
    }

    const div = doc.querySelector('div[data-provider="dailymotion"]');
    if (null !== div) {
        return await metaExtract(
            new URL(
                `https://www.dailymotion.com/embed/video/${div.dataset.id}`,
            ),
            { ...context, depth: true },
        );
    }

    const blockquote = doc.querySelector("blockquote.tiktok-embed");
    if (null !== blockquote) {
        return await metaExtract(new URL(blockquote.cite), {
            ...context,
            depth: true,
        });
    }

    return undefined;
};
export const extract = matchURLPattern(action, "https://www.lemonde.fr/*");
