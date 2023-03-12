/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as permission from "../../../src/core/permission.js";

describe("core/permission.js", function () {
    describe("checkHosts()", function () {
        it("should return 'true'", async function () {
            browser.permissions.request({ origins: ["<all_urls>"] });

            const granted = await permission.checkHosts();

            assert.equal(granted, true);
        });

        it("should throw error", async function () {
            browser.permissions.request({ origins: ["http://foo.com/"] });

            await assert.rejects(() => permission.checkHosts(), {
                name: "PebkacError",
                type: "notGranted",
            });
        });
    });
});
