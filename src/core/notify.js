/**
 * @module
 */

import { PebkacError } from "./pebkac.js";

/**
 * Notifie l'utilisateur d'un message d'erreur.
 *
 * @param {PebkacError|Error} err L'erreur affichée dans la notification.
 */
export const notify = function (err) {
    // Ne pas ajouter un bouton vers la configuration car cette fonctionnalité
    // n'est pas encore implémentée.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1190681
    browser.notifications.create({
        type:    "basic",
        iconUrl: "img/icon.svg",
        title:   err instanceof PebkacError
                       ? err.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
        message: err.message,
    });
};
