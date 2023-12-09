/**
 * @module
 * @license MIT
 * @see https://www.melty.fr/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire les données de la vidéo.
 *
 * @type {RegExp}
 */
const DATA_REGEXP =
    /init_nouveau_player_dailymotion\("[^"]+","(?<id>[^"]+)", params\);/u;

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'un article de Melty.
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
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = DATA_REGEXP.exec(script.text);
        if (null !== result) {
            const file = await metaExtract(
                new URL(
                    `https://www.dailymotion.com/video/${result.groups.id}`,
                ),
                {
                    ...context,
                    depth: true,
                },
            );
            if (undefined !== file) {
                return file;
            }
        }
    }
    return undefined;
};
export const extract = matchPattern(action, "*://www.melty.fr/*");
