/**
 * @license MIT
 * @author Sébastien Règne
 */

import sinon from "sinon";
import { clear } from "../polyfill/browser.js";

export const mochaHooks = {
    afterEach: () => {
        sinon.restore();
        clear();
    },
};
