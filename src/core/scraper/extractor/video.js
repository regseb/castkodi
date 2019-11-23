/**
 * @module
 */

/**
 * La liste des sélecteur retournant les éléments <code>audio</code> et leurs
 * sources.
 *
 * @constant {Array.<string>}
 */
const SELECTORS = ["video source[src]", "video[src]"];

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {HTMLDocument} doc Le contenu HTML d'une page quelconque.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
export const action = function (doc) {
    const video = SELECTORS.map((s) => doc.querySelector(s))
                           .find((v) => null !== v);
    return undefined === video ? null
                               : video.getAttribute("src");
};
