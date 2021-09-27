/**
 * @module
 */

browser.runtime.getBrowserInfo().then(({ name }) => {
    document.documentElement.classList.add(name);
});
