/**
 * @module
 * @license MIT
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
              { ...options, depth: true },
          );
};
export const extract = matchPattern(action, "*://www.lepoint.fr/*");
