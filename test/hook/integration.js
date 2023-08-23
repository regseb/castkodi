/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { kodi } from "../../src/core/jsonrpc/kodi.js";

export const mochaHooks = {
    beforeAll: () => {
        kodi.addons.getAddons = () => Promise.resolve([]);
    },
};
