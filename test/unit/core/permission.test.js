/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import * as permission from "../../../src/core/permission.js";
import { restoreAll } from "../../polyfill/browser.js";
import "../setup.js";

describe("core/permission.js", () => {
    describe("checkHosts()", () => {
        afterEach(() => {
            restoreAll();
        });

        it("should return 'true'", async () => {
            await browser.permissions.request({ origins: ["<all_urls>"] });

            const granted = await permission.checkHosts();

            assert.equal(granted, true);
        });

        it("should throw error", async () => {
            await browser.permissions.request({ origins: ["https://foo.tv/"] });

            await assert.rejects(() => permission.checkHosts(), {
                name: "PebkacError",
                type: "notGranted",
            });
        });
    });
});
