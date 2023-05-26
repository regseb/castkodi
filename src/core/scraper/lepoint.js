/**
 * @module
 * @license MIT
 * @see https://www.lepoint.fr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi. Les pages
 * avec des vidéos Dailymotion contiennent des microdonnées, mais c'est l'URL de
 * la page embarquée de Dailymotion qui est renseignée dans le champ de l'URL
 * de la vidéo. Il faut donc récupérer l'identifiant de la vidéo Dailymotion
 * dans les balises HTML. Pour les vidéos YouTube, elles sont extraites
 * directement de l'iframe.
 *
 * @param {URL}      _url              L'URL d'une vidéo du Point.
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
    const blockquote = doc.querySelector(
        "blockquote.video-dailymotion-unloaded[data-videoid]",
    );
    return null === blockquote
        ? undefined
        : metaExtract(
              new URL(
                  "https://www.dailymotion.com/embed/video/" +
                      blockquote.dataset.videoid,
              ),
              { ...context, depth: true },
          );
};
export const extract = matchPattern(action, "*://www.lepoint.fr/*");
