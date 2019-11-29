/**
 * @module
 */

/**
 * L'URL du répertoire où sont les sons de Arte Radio.
 *
 * @constant {string}
 */
const API_URL = "https://api.arte.tv/api/player/v1/config";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Arte.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
rules.set(["*://www.arte.tv/*/videos/*/*"], async function ({ pathname }) {
    const [, lang, , id] = pathname.split("/");
    const response = await fetch(`${API_URL}/${lang}/${id}`);
    const json = await response.json();

    return Object.values(json.videoJsonPlayer.VSR)
                 // Garder les vidéos dans la langue courante.
                 .filter((f) => f.id.endsWith("_1"))
                 // Sélectionner la vidéo avec la définition la plus grande.
                 .reduce((b, f) => (b.height < f.height ? f : b))
                 .url;
});
