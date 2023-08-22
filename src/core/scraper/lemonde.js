/**
 * @module
 * @license MIT
 * @see https://www.lemonde.fr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page du Monde.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata, context) {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();

    const source = doc.querySelector('video source[type="video/youtube"]');
    if (null !== source) {
        return metaExtract(new URL(source.src), { ...context, depth: true });
    }

    const div = doc.querySelector('div[data-provider="dailymotion"]');
    if (null !== div) {
        return metaExtract(
            new URL(
                `https://www.dailymotion.com/embed/video/${div.dataset.id}`,
            ),
            { ...context, depth: true },
        );
    }

    const blockquote = doc.querySelector("blockquote.tiktok-embed");
    if (null !== blockquote) {
        return metaExtract(new URL(blockquote.cite), {
            ...context,
            depth: true,
        });
    }

    return undefined;
};
export const extract = matchPattern(action, "*://www.lemonde.fr/*");
