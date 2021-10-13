/**
 * @module
 */

import { PebkacError } from "./pebkac.js";

/**
 * Notifie l'utilisateur d'un message d'erreur.
 *
 * @param {PebkacError|Error} err L'erreur affichée dans la notification.
 * @returns {Promise<string>} Une promesse contenant l'identifiant de la
 *                            notification.
 */
export const notify = function (err) {
    // Ne pas ajouter un bouton vers la configuration car cette fonctionnalité
    // n'est pas encore implémentée dans Firefox.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1190681
    // L'icône n'est pas affichée dans Chromium sous Linux.
    // https://crbug.com/1164769
    return browser.notifications.create({
        type:    "basic",
        iconUrl: "/img/icon.svg",
        title:   err instanceof PebkacError
                       ? err.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
        message: err.message,
    });
};
