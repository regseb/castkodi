/**
 * @license MIT
 * @author Sébastien Règne
 */

import { clear } from "../polyfill/browser.js";

export const mochaHooks = {
    afterEach: () => {
        clear();
    },
};
