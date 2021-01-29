import assert from "assert";
// eslint-disable-next-line import/no-unassigned-import
import "../../../src/background/permissions.js";

describe("background/permissions.js", function () {
    describe("handleRemove()", function () {
        it("should handle history", async function () {
            await browser.permissions.request({
                permissions: ["foo", "history"],
            });
            browser.storage.local.set({ "general-history": true });

            await browser.permissions.remove({ permissions: ["foo"] });
            let config = await browser.storage.local.get(["general-history"]);
            assert.strictEqual(config["general-history"], true);

            await browser.permissions.remove({ permissions: [] });
            config = await browser.storage.local.get(["general-history"]);
            assert.strictEqual(config["general-history"], true);

            await browser.permissions.remove({ permissions: ["history"] });
            config = await browser.storage.local.get(["general-history"]);
            assert.strictEqual(config["general-history"], false);

            await browser.permissions.remove({ permissions: ["history"] });
            config = await browser.storage.local.get(["general-history"]);
            assert.strictEqual(config["general-history"], false);

            browser.storage.local.clear();
        });

        it("should handle bookmarks", async function () {
            await browser.permissions.request({
                permissions: ["foo", "bookmarks"],
            });
            browser.storage.local.set({ "menu-contexts": ["bar", "bookmark"] });

            await browser.permissions.remove({ permissions: ["foo"] });
            let config = await browser.storage.local.get(["menu-contexts"]);
            assert.deepStrictEqual(config["menu-contexts"],
                                   ["bar", "bookmark"]);

            await browser.permissions.remove({ permissions: [] });
            config = await browser.storage.local.get(["menu-contexts"]);
            assert.deepStrictEqual(config["menu-contexts"],
                                   ["bar", "bookmark"]);

            await browser.permissions.remove({ permissions: ["bookmarks"] });
            config = await browser.storage.local.get(["menu-contexts"]);
            assert.deepStrictEqual(config["menu-contexts"], ["bar"]);

            await browser.permissions.remove({ permissions: ["bookmarks"] });
            config = await browser.storage.local.get(["menu-contexts"]);
            assert.deepStrictEqual(config["menu-contexts"], ["bar"]);

            browser.storage.local.clear();
        });
    });
});
