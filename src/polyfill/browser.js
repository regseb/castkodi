/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// Copier la variable "chrome" (qui contient les APIs pour les WebExtensions)
// dans la variable "browser", car Chromium fournit seulement "chrome".
// https://issues.chromium.org/40556351
if (!("browser" in globalThis)) {
    globalThis.browser = chrome;
}

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

// Contourner un bogue dans Firefox sous Android : quand la page des options est
// ouverte avec la fonction openOptionPage(), la page reste blanche.
// https://bugzil.la/1795449#c2
const nativeOpenOptionsPage = browser.runtime.openOptionsPage;
browser.runtime.openOptionsPage = async () => {
    // Ne pas sortir la fonction getPlatformInfo(), car les service workers
    // n'autorisent pas les top-level await.
    const platformInfo = await browser.runtime.getPlatformInfo();
    if ("android" === platformInfo.os) {
        await browser.tabs.create({
            url: browser.runtime.getManifest().options_ui.page,
        });
    } else {
        await nativeOpenOptionsPage();
    }
};
