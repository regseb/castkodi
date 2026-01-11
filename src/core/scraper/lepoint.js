/**
 * @module
 * @license MIT
 * @see https://www.lepoint.fr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi. Les pages
 * avec des vidéos Dailymotion contiennent des microdonnées, mais c'est l'URL de
 * la page embarquée de Dailymotion qui est renseignée dans le champ de l'URL
 * de la vidéo. Il faut donc récupérer l'identifiant de la vidéo Dailymotion
 * dans les balises HTML. Pour les vidéos YouTube, elles sont extraites
 * directement de l'iframe.
 *
 * @param {URLMatch} _url              L'URL d'une vidéo du Point.
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
    const div = doc.querySelector('div[id^="dailymotion-player-"]');
    if (null === div) {
        return undefined;
    }

    const parts = div.id.split("-");
    return await metaExtract(
        new URL(`https://www.dailymotion.com/embed/video/${parts[3]}`),
        { ...context, depth: true },
    );
};
export const extract = matchURLPattern(action, "https://www.lepoint.fr/*");
