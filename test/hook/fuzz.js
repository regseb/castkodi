/**
 * @license MIT
 * @author Sébastien Règne
 */

import { kodi } from "../../src/core/jsonrpc/kodi.js";

export const mochaHooks = {
    beforeAll: () => {
        globalThis.fetch = () => Promise.resolve(new Response());
        kodi.addons.getAddons = () => Promise.resolve([]);
    },
};
