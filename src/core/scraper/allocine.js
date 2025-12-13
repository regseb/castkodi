/**
 * @module
 * @license MIT
 * @see https://www.allocine.fr/
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
 * @param {URLMatch} _url              L'URL d'une vidéo AlloCiné.
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
    const figure = doc.querySelector("figure[data-model]");
    if (null === figure) {
        return undefined;
    }

    const model = JSON.parse(figure.dataset.model);
    return metaExtract(
        new URL(
            "https://www.dailymotion.com/video/" +
                model.videos[0].idDailymotion,
        ),
        {
            ...context,
            depth: true,
        },
    );
};
export const extract = matchURLPattern(action, "https://www.allocine.fr/*");
