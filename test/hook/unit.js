/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

export const mochaHooks = {
    beforeAll: () => {
        globalThis.fetch = () => {
            throw new Error("do not use real fetch for unit tests");
        };
    },
};
