/**
 * @module
 */

/**
 * Notifie l'utilisateur d'un message d'erreur.
 *
 * @function
 * @param {Error|Object} err L'erreur affichée dans la notification.
 */
export const notify = function (err) {
    // Ne pas ajouter un bouton vers la configuration car cette fonctionnalité
    // n'est pas encore implémentée.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1190681
    browser.notifications.create(null, {
        type:    "basic",
        iconUrl: "img/icon.svg",
        title:   "PebkacError" === err.name
                       ? err.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
        message: err.message,
    });
};
