/**
 * @module
 */

// Copier la variable "chrome" (qui contient les APIs pour les webextensions)
// dans la variable "browser" car Chromium fournit seulement "chrome".
// https://crbug.com/798169
if (!("browser" in globalThis)) {
    globalThis.browser = chrome;
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
