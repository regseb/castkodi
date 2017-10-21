"use strict";

define([], function () {

    /**
     * Notifie l'utilisateur d'un message d'erreur.
     *
     * @param {Object} error L'erreur affichée dans la notification.
     */
    const notify = function (error) {
        browser.notifications.create(null, {
            "type":    "basic",
            "iconUrl": "img/icon.svg",
            "title":   "PebkacError" === error.name
                       ? error.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
            "message": error.message
        });
    };

    return notify;
});
