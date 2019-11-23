/**
 * @module
 */

/**
 * La liste des sélecteur retournant les éléments <code>audio</code> et leurs
 * sources.
 *
 * @constant {Array.<string>}
 */
const SELECTORS = ["audio source[src]", "audio[src]"];

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {HTMLDocument} doc Le contenu HTML d'une page quelconque.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
export const action = function (doc) {
    const audio = SELECTORS.map((s) => doc.querySelector(s))
                           .find((a) => null !== a);
    return undefined === audio ? null
                               : audio.getAttribute("src");
};
