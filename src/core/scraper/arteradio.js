/**
 * @module
 */

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @constant {string}
 */
const BASE_URL = "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                         "/default/files/sons/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'un son Arte Radio.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set(["*://www.arteradio.com/son/*"], async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    return BASE_URL + doc.querySelector(".cover *[data-sound-href]")
                         .dataset.soundHref;
});
