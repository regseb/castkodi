/**
 * @module
 */

import dialogPolyfill from "./lib/dialog-polyfill-esm.js";

// Utiliser une prothèse en attendant que les boites de dialogue soient
// implémentées dans Firefox. https://bugzil.la/840640
if ("undefined" === typeof HTMLDialogElement) {
    HTMLUnknownElement.prototype.showModal = function showModal() {
        // Supprimer la méthode showModal() de cette instance pour la remplacer
        // par la prothèse.
        this.showModal = undefined;
        dialogPolyfill.registerDialog(this);
        this.showModal();
    };
}
