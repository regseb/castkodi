/**
 * @module
 */

import { PebkacError } from "./pebkac.js";

/**
 * Notifie l'utilisateur d'un message d'erreur.
 *
 * @param {Error} err L'erreur affichée dans la notification.
 * @returns {Promise<string>} Une promesse contenant l'identifiant de la
 *                            notification.
 */
export const notify = function (err) {
    // Ne pas ajouter un bouton vers la configuration car cette fonctionnalité
    // n'est pas encore implémentée dans Firefox. https://bugzil.la/1190681
    return browser.notifications.create({
        type:    "basic",
        // Ne pas utiliser un fichier SVG pour l'icône car depuis le Manifest
        // V3 : Chromium ne le gère plus. https://crbug.com/1353252
        // L'icône n'est pas affichée dans Chromium sous Linux.
        // https://crbug.com/1164769
        iconUrl: "/img/icon128.png",
        title:   err instanceof PebkacError
            ? err.title
            : browser.i18n.getMessage("notifications_unknown_title"),
        message: err.message,
    });
};
