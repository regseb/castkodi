/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @constant {string}
 */
const BASE_URL = "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                         "/default/files/sons/";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}          _url L'URL d'un son Arte Radio.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const action = async function (_url, doc) {
    return BASE_URL + doc.querySelector(".cover *[data-sound-href]")
                         .dataset.soundHref;
};
export const extract = matchPattern(action,
    "*://www.arteradio.com/son/*");
