/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// Ajouter une prothèse pour la méthode browser.runtime.getBrowserInfo() qui
// n'est pas implémentée dans Chromium. https://issues.chromium.org/40671645
if (!("getBrowserInfo" in browser.runtime)) {
    browser.runtime.getBrowserInfo = () => {
        const { protocol } = new URL(browser.runtime.getURL(""));
        switch (protocol) {
            case "chrome-extension:":
                return Promise.resolve({ name: "Chromium" });
            case "moz-extension:":
                return Promise.resolve({ name: "Firefox" });
            default:
                return Promise.reject(new Error("unknown browser"));
        }
    };
}

// Contourner un bogue dans Firefox Nightly sous Android qui retourne "Firefox
// Nightly" pour le nom du navigateur alors qu'il faudrait avoir seulement
// "Firefox". https://bugzil.la/1864824
const nativeGetBrowserInfo = browser.runtime.getBrowserInfo;
browser.runtime.getBrowserInfo = async () => {
    const browserInfo = await nativeGetBrowserInfo();
    return {
        ...browserInfo,
        name: browserInfo.name.replace(" Nightly", ""),
    };
};
