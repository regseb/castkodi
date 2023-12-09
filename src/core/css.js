/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

const info = await browser.runtime.getBrowserInfo();
document.documentElement.classList.add(info.name);
