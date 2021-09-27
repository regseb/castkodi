/**
 * @module
 */

// eslint-disable-next-line import/no-unassigned-import
import "./lib/browser-polyfill.js";
import dialogPolyfill from "./lib/dialog-polyfill-esm.js";

// Utiliser une prothèse en attendant que les boites de dialogue soient
// implémentées dans Firefox.
// https://bugzilla.mozilla.org/show_bug.cgi?id=840640
if ("undefined" === typeof HTMLDialogElement) {
    HTMLUnknownElement.prototype.showModal = function showModal() {
        // Supprimer la méthode showModal() de cette instance pour la remplacer
        // par la prothèse.
        this.showModal = undefined;
        dialogPolyfill.registerDialog(this);
        this.showModal();
    };
}

// Ajouter une prothèse pour la méthode browser.runtime.getBrowserInfo() qui
// n'est pas implémentée dans Chromium. https://crbug.com/1047907
if (!("getBrowserInfo" in browser.runtime)) {
    browser.runtime.getBrowserInfo = () => {
        const { protocol } = new URL(browser.runtime.getURL(""));
        switch (protocol) {
            case "chrome-extension:":
                return Promise.resolve({ name: "Chrome" });
            case "moz-extension:":
                return Promise.resolve({ name: "Firefox" });
            default:
                return Promise.reject(new Error("unknown browser"));
        }
    };
}
