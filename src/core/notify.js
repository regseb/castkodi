/**
 * @module
 */

/**
 * Notifie l'utilisateur d'un message d'erreur.
 *
 * @function notify
 * @param {object} err L'erreur affichée dans la notification.
 * @returns {Promise} Une promesse rejetée contenant l'erreur.
 */
export const notify = function (err) {
    browser.notifications.create(null, {
        "type":    "basic",
        "iconUrl": "img/icon.svg",
        "title":   "PebkacError" === err.name
                       ? err.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
        "message": err.message
    });
    return Promise.reject(err);
};
