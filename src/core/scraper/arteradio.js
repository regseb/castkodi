/**
 * @module
 * @license MIT
 * @see https://www.arteradio.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @type {string}
 */
const BASE_URL =
    "https://cdn.arteradio.com/permanent/arteradio/sites/default/files/sons/";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'un son Arte Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    return (
        BASE_URL +
        doc.querySelector(".cover *[data-sound-href]").dataset.soundHref
    );
};
export const extract = matchPattern(action, "*://www.arteradio.com/son/*");
