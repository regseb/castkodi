/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @type {string}
 */
const BASE_URL = "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                         "/default/files/sons/";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}      _url         L'URL d'un son Arte Radio.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    return BASE_URL + doc.querySelector(".cover *[data-sound-href]")
                         .dataset.soundHref;
};
export const extract = matchPattern(action, "*://www.arteradio.com/son/*");
