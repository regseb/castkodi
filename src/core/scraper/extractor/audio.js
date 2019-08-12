/**
 * @module
 */

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {HTMLDocument} doc Le contenu HTML d'une page quelconque.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
export const action = function (doc) {
    const audio = doc.querySelector("audio source[src], audio[src]");
    return null === audio ? null
                          : audio.src;
};
