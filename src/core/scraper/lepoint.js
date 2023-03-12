/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import * as plugin from "../plugin/dailymotion.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi. Les pages
 * avec des vidéos Dailymotion contiennent des microdonnées, mais c'est l'URL de
 * la page embarquée de Dailymotion qui est renseignée dans le champ de l'URL
 * de la vidéo. Il faut donc récupérer  l'identifiant de la vidéo Dailymotion
 * dans les balises HTML. Pour les vidéos YouTube, elles sont extraites
 * directement de l'iframe.
 *
 * @param {URL}      _url         L'URL d'une vidéo du Point.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const blockquote = doc.querySelector(
        "blockquote.video-dailymotion-unloaded[data-videoid]",
    );
    return null === blockquote
        ? undefined
        : plugin.generateUrl(blockquote.dataset.videoid);
};
export const extract = matchPattern(action, "*://www.lepoint.fr/*");
