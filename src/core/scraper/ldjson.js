/**
 * @module
 * @license MIT
 * @see https://json-ld.org/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * La liste des types pouvant contenir des URLs de son ou de vidéo.
 *
 * @type {Set<string>}
 */
const TYPES = new Set(["AudioObject", "MusicVideoObject", "VideoObject"]);

/**
 * Le sélecteur retournant les scripts contenant des microdonnées.
 *
 * @type {string}
 */
const SELECTOR = 'script[type="application/ld+json"]';

/**
 * Extrait récursivement les propriétés de type objet d'un objet JSON.
 *
 * @param {any} root Un élément du JSON.
 * @returns {Object[]} La liste des objets extraits.
 */
const walk = (root) => {
    return null !== root && "object" === typeof root
        ? [root, ...Object.values(root).flatMap(walk)]
        : [];
};

/**
 * Extrait les informations nécessaires pour lire un média sur Kodi.
 *
 * @param {URLMatch} url               L'URL d'une page quelconque.
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
 */
const action = async (url, metadata, context) => {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    for (const script of doc.querySelectorAll(SELECTOR)) {
        try {
            for (const property of walk(JSON.parse(script.text))) {
                if (!TYPES.has(property["@type"])) {
                    continue;
                }

                if ("contentUrl" in property) {
                    return property.contentUrl;
                }
                if ("embedUrl" in property && !context.depth) {
                    const file = await metaExtract(
                        new URL(property.embedUrl, url),
                        { ...context, depth: true },
                    );
                    if (undefined !== file) {
                        return file;
                    }
                }
            }
        } catch {
            // Ignorer les microdonnées ayant un JSON invalide.
        }
    }
    return undefined;
};
export const extract = matchURLPattern(action, "*://*/*");
