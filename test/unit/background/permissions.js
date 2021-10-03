import assert from "node:assert";
// eslint-disable-next-line import/no-unassigned-import

describe("background/permissions.js", function () {
    describe("handleRemove()", function () {
        it("should handle history", async function () {
            await browser.permissions.request({
                permissions: ["foo", "history"],
            });
            browser.storage.local.set({ "general-history": true });

            await import("../../../src/background/permissions.js?" +
                                                                    Date.now());

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
        });

        it("should handle bookmarks", async function () {
            await browser.permissions.request({
                permissions: ["foo", "bookmarks"],
            });
            browser.storage.local.set({ "menu-contexts": ["bar", "bookmark"] });

            await import("../../../src/background/permissions.js?" +
                                                                    Date.now());

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
        });
    });
});
