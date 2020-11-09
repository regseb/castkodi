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
    browser.notifications.create(null, {
        type:    "basic",
        iconUrl: "img/icon.svg",
        title:   "PebkacError" === err.name
                       ? err.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
        message: err.message,
    });
};
