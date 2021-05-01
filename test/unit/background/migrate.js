import assert from "node:assert";

describe("background/migrate.js", function () {
    it("should create config", async function () {
        browser.storage.local.set({ foo: "bar" });

        await import("../../../src/background/migrate.js?" + Date.now());
        const config = await browser.storage.local.get();
        assert.deepStrictEqual(config, {
            "config-version":   4,
            "server-mode":      "single",
            "server-list":      [{ address: "", name: "" }],
            "server-active":    0,
            "general-history":  false,
            "menu-actions":     ["send", "insert", "add"],
            "menu-contexts":    [
                "audio", "frame", "link", "page", "selection", "tab", "video",
            ],
            "youtube-playlist": "playlist",
            "youtube-order":    "",
        });

        browser.storage.local.clear();
    });

    it("should upgrade from version '1'", async function () {
        browser.storage.local.set({
            "config-version":     1,
            "connection-host":    "foo",
            "general-history":    true,
            "menus-send":         false,
            "menus-insert":       true,
            "menus-add":          false,
            "contexts-audio":     true,
            "contexts-frame":     false,
            "contexts-link":      true,
            "contexts-page":      false,
            "contexts-selection": true,
            "contexts-tab":       false,
            "contexts-video":     true,
            "youtube-playlist":   "video",
            bar:                  "baz",
        });

        await import("../../../src/background/migrate.js?" + Date.now());
        const config = await browser.storage.local.get();
        assert.deepStrictEqual(config, {
            "config-version":   4,
            "server-mode":      "single",
            "server-list":      [{ address: "foo", name: "" }],
            "server-active":    0,
            "general-history":  true,
            "menu-actions":     ["insert"],
            "menu-contexts":    ["audio", "link", "selection", "video"],
            "youtube-playlist": "video",
            "youtube-order":    "",
        });

        browser.storage.local.clear();
    });

    it("should upgrade from version '2'", async function () {
        browser.storage.local.set({
            "config-version":   2,
            "server-mode":      "multi",
            "server-list":      [
                { host: "foo",              name: "bar" },
                { host: "https://baz.com/", name: "qux" },
            ],
            "server-active":    1,
            "general-history":  false,
            "menu-actions":     ["send"],
            "menu-contexts":    [],
            "youtube-playlist": "playlist",
        });

        await import("../../../src/background/migrate.js?" + Date.now());
        const config = await browser.storage.local.get();
        assert.deepStrictEqual(config, {
            "config-version":   4,
            "server-mode":      "multi",
            "server-list":      [
                { address: "foo",              name: "bar" },
                { address: "https://baz.com/", name: "qux" },
            ],
            "server-active":    1,
            "general-history":  false,
            "menu-actions":     ["send"],
            "menu-contexts":    [],
            "youtube-playlist": "playlist",
            "youtube-order":    "",
        });

        browser.storage.local.clear();
    });

    it("should upgrade from version '3'", async function () {
        browser.storage.local.set({
            "config-version":   3,
            "server-mode":      "single",
            "server-list":      [{ host: "foo", name: "" }],
            "server-active":    0,
            "general-history":  true,
            "menu-actions":     [],
            "menu-contexts":    [],
            "youtube-playlist": "playlist",
        });

        await import("../../../src/background/migrate.js?" + Date.now());
        const config = await browser.storage.local.get();
        assert.deepStrictEqual(config, {
            "config-version":   4,
            "server-mode":      "single",
            "server-list":      [{ host: "foo", name: "" }],
            "server-active":    0,
            "general-history":  true,
            "menu-actions":     [],
            "menu-contexts":    [],
            "youtube-playlist": "playlist",
            "youtube-order":    "",
        });

        browser.storage.local.clear();
    });

    it("should do nothing from version '4'", async function () {
        browser.storage.local.set({
            "config-version":   4,
            "server-mode":      "multi",
            "server-list":      [
                { address: "foo",              name: "bar" },
                { address: "https://baz.com/", name: "qux" },
            ],
            "server-active":    1,
            "general-history":  true,
            "menu-actions":     [],
            "menu-contexts":    ["bookmark"],
            "youtube-playlist": "video",
            "youtube-order":    "default",
        });

        await import("../../../src/background/migrate.js?" + Date.now());
        const config = await browser.storage.local.get();
        assert.deepStrictEqual(config, {
            "config-version":   4,
            "server-mode":      "multi",
            "server-list":      [
                { address: "foo",              name: "bar" },
                { address: "https://baz.com/", name: "qux" },
            ],
            "server-active":    1,
            "general-history":  true,
            "menu-actions":     [],
            "menu-contexts":    ["bookmark"],
            "youtube-playlist": "video",
            "youtube-order":    "default",
        });

        browser.storage.local.clear();
    });
});
