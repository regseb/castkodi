/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// Utiliser une async IIFE car addons-linter échoue à analyser les fichiers sans
// import / export et avec un await dans le scope global.
// https://github.com/mozilla/addons-linter/issues/4020
// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const info = await browser.runtime.getBrowserInfo();
    document.documentElement.classList.add(info.name);
})();
