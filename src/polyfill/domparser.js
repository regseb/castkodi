/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import * as linkedom from "./lib/linkedom.js";

// Utiliser LinkeDOM pour simuler DOMParser dans le service worker.
// https://issues.chromium.org/40120299
if (!("DOMParser" in globalThis)) {
    globalThis.DOMParser = linkedom.DOMParser;

    // Ajouter des propriétés manquantes dans les classes fournies par LinkeDOM.
    // Comme document.querySelector() ne retourne pas la classe spécifique :
    // ajouter les propriétés dans HTMLElement.
    // https://github.com/WebReflection/linkedom/issues/184
    Object.defineProperties(linkedom.HTMLElement.prototype, {
        // Ajouter HTMLEmbedElement.type.
        type: {
            get() {
                return this.getAttribute("type") ?? "";
            },
        },
        // Ajouter HTMLVideoElement.poster.
        poster: {
            get() {
                return this.getAttribute("poster") ?? "";
            },
        },
        // Ajouter HTMLBlockquoteElement.cite.
        cite: {
            get() {
                return this.getAttribute("cite") ?? "";
            },
        },
    });
}
