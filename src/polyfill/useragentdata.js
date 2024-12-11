/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// Ajouter une prothèse pour la propriété navigator.userAgentData qui n'est pas
// implémentée dans Firefox. https://bugzil.la/1750143
if (!("userAgentData" in navigator)) {
    const browserInfo = await browser.runtime.getBrowserInfo();
    const platformInfo = await browser.runtime.getPlatformInfo();
    navigator.userAgentData = {
        brands: [
            { brand: browserInfo.name, version: browserInfo.version },
            { brand: "Not A Brand", version: "1" },
        ],
        mobile: "android" === platformInfo.os,
        platform: platformInfo.os[0].toUpperCase() + platformInfo.os.slice(1),
    };
}
