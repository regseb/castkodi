/**
 * @module core/notify
 */

/**
 * Notifie l'utilisateur d'un message d'erreur.
 *
 * @function notify
 * @param {Object} error L'erreur affichée dans la notification.
 */
export const notify = function (error) {
    browser.notifications.create(null, {
        "type":    "basic",
        "iconUrl": "img/icon.svg",
        "title":   "PebkacError" === error.name
                       ? error.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
        "message": error.message
    });
};
