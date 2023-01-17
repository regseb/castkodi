/**
 * @module
 */

import sinon from "sinon";

export const mochaHooks = {
    afterEach: () => {
        sinon.restore();
        // eslint-disable-next-line no-underscore-dangle
        browser._clear();
    },
};
