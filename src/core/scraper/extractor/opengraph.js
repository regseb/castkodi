/**
 * @module
 */

/**
 * La liste des sélecteur retournant les éléments <code>meta</code> liés aux
 * vidéos et audio d'Open Graph.
 *
 * @constant {Array.<string>}
 */
const SELECTORS = [
    `meta[property="og:video:secure_url"]`,
    `meta[property="og:video:url"]`,
    `meta[property="og:video"]`,
    `meta[property="og:audio:secure_url"]`,
    `meta[property="og:audio:url"]`,
    `meta[property="og:audio"]`
];

/**
 * Extrait les informations nécessaire pour lire un son ou une vidéo sur Kodi.
 *
 * @function action
 * @param {HTMLDocument} doc Le contenu HTML d'une page quelconque.
 * @returns {?string} Le lien du <em>fichier</em> ou <code>null</code>.
 */
export const action = function (doc) {
    const meta = SELECTORS.map((s) => doc.querySelector(s))
                          .find((m) => null !== m);
    return undefined === meta ? null
                              : meta.content;
};
