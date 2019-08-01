/**
 * @module
 */

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {HTMLDocument} doc Le contenu HTML d'une page quelconque.
 * @returns {?string} L'URL du <em>fichier</em> ou <code>null</code>.
 */
export const action = function (doc) {
    const video = doc.querySelector("video source[src], video[src]");
    return null === video ? null
                          : video.src;
};
