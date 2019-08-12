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
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url          L'URL d'une vidéo Arte.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em>.
 */
rules.set("*://www.arte.tv/*/videos/*/*", function ({ pathname }) {
    const [, lang, , id] = pathname.split("/");
    const url = `${API_URL}/${lang}/${id}`;
    return fetch(url).then((r) => r.json())
                     .then(({ "videoJsonPlayer": { "VSR": data } }) => {
        // Garder les vidéos dans la langue courante.
        return Object.values(data).filter((f) => f.id.endsWith("_1"))
                     // Sélectionner la vidéo avec la définition la plus grande.
                     .reduce((b, f) => (b.height < f.height ? f : b))
                     .url;
    });
});
