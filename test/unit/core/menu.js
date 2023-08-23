/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import * as menu from "../../../src/core/menu.js";

describe("core/menu.js", function () {
    describe("update()", function () {
        it("shouldn't add item because no action", async function () {
            await browser.storage.local.set({
                "server-mode": "single",
                "menu-actions": [],
                "menu-contexts": ["audio"],
            });
            const spy = sinon.spy(browser.contextMenus, "create");

            await menu.update();

            assert.equal(spy.callCount, 0);
        });

        it("shouldn't add item because no context", async function () {
            await browser.storage.local.set({
                "server-mode": "single",
                "menu-actions": ["send"],
                "menu-contexts": [],
            });
            const spy = sinon.spy(browser.contextMenus, "create");

            await menu.update();

            assert.equal(spy.callCount, 0);
        });

        it("should add one item", async function () {
            await browser.storage.local.set({
                "server-mode": "single",
                "menu-actions": ["send"],
                "menu-contexts": ["frame"],
            });
            const spy = sinon.spy(browser.contextMenus, "create");

            await menu.update();

            assert.equal(spy.callCount, 1);
            assert.deepEqual(spy.firstCall.args, [
                {
                    contexts: ["frame"],
                    id: "send",
                    title: "Play now to Kodi",
                },
            ]);
        });

        it("should add two items", async function () {
            await browser.storage.local.set({
                "server-mode": "single",
                "menu-actions": ["insert", "add"],
                "menu-contexts": ["link"],
            });
            const spy = sinon.spy(browser.contextMenus, "create");

            await menu.update();

            assert.equal(spy.callCount, 3);
            assert.deepEqual(spy.firstCall.args, [
                {
                    contexts: ["link"],
                    id: "parent",
                    title: "Cast to Kodi",
                },
            ]);
            assert.deepEqual(spy.secondCall.args, [
                {
                    contexts: ["link"],
                    id: "insert",
                    parentId: "parent",
                    title: "Play next",
                },
            ]);
            assert.deepEqual(spy.thirdCall.args, [
                {
                    contexts: ["link"],
                    id: "add",
                    parentId: "parent",
                    title: "Queue item",
                },
            ]);
        });

        it("should add two servers", async function () {
            await browser.storage.local.set({
                "server-mode": "multi",
                "server-list": [
                    {
                        address: "192.168.0.1",
                        name: "foo",
                    },
                    {
                        address: "ws://192.168.0.1:9090/jsonrpc",
                        name: "",
                    },
                ],
                "server-active": 1,
                "menu-actions": ["send"],
                "menu-contexts": ["page"],
            });
            const spy = sinon.spy(browser.contextMenus, "create");

            await menu.update();

            assert.equal(spy.callCount, 5);
            assert.deepEqual(spy.getCall(0).args, [
                {
                    contexts: ["page"],
                    id: "parent",
                    title: "Cast to Kodi",
                },
            ]);
            assert.deepEqual(spy.getCall(1).args, [
                {
                    contexts: ["page"],
                    id: "send",
                    parentId: "parent",
                    title: "Play now",
                },
            ]);
            assert.deepEqual(spy.getCall(2).args, [
                {
                    contexts: ["page"],
                    id: "separator",
                    parentId: "parent",
                    type: "separator",
                },
            ]);
            assert.deepEqual(spy.getCall(3).args, [
                {
                    checked: false,
                    contexts: ["page"],
                    id: "0",
                    parentId: "parent",
                    title: "foo",
                    type: "radio",
                },
            ]);
            assert.deepEqual(spy.getCall(4).args, [
                {
                    checked: true,
                    contexts: ["page"],
                    id: "1",
                    parentId: "parent",
                    title: "(noname 2)",
                    type: "radio",
                },
            ]);
        });

        it("should add three items and one multi-server", async function () {
            await browser.storage.local.set({
                "server-mode": "multi",
                "server-list": [
                    {
                        address: "foo",
                        name: "  ",
                    },
                ],
                "server-active": 1,
                "menu-actions": ["send", "insert", "add"],
                "menu-contexts": ["selection", "video"],
            });
            const spy = sinon.spy(browser.contextMenus, "create");

            await menu.update();

            assert.equal(spy.callCount, 6);
            assert.deepEqual(spy.getCall(0).args, [
                {
                    contexts: ["selection", "video"],
                    id: "parent",
                    title: "Cast to Kodi",
                },
            ]);
            assert.deepEqual(spy.getCall(1).args, [
                {
                    contexts: ["selection", "video"],
                    id: "send",
                    parentId: "parent",
                    title: "Play now",
                },
            ]);
            assert.deepEqual(spy.getCall(2).args, [
                {
                    contexts: ["selection", "video"],
                    id: "insert",
                    parentId: "parent",
                    title: "Play next",
                },
            ]);
            assert.deepEqual(spy.getCall(3).args, [
                {
                    contexts: ["selection", "video"],
                    id: "add",
                    parentId: "parent",
                    title: "Queue item",
                },
            ]);
            assert.deepEqual(spy.getCall(4).args, [
                {
                    contexts: ["selection", "video"],
                    id: "separator",
                    parentId: "parent",
                    type: "separator",
                },
            ]);
            assert.deepEqual(spy.getCall(5).args, [
                {
                    checked: false,
                    contexts: ["selection", "video"],
                    id: "0",
                    parentId: "parent",
                    title: "(noname 1)",
                    type: "radio",
                },
            ]);
        });
    });

    describe("aggregate()", function () {
        it("should return bookmark url", async function () {
            const { id } = browser.bookmarks.create({ url: "http://foo.com/" });

            const urls = await menu.aggregate({
                menuItemId: "send",
                modifiers: [],
                editable: false,
                bookmarkId: id,
            });
            assert.deepEqual(urls, ["http://foo.com/"]);
        });

        it("should return bookmark title", async function () {
            const { id } = browser.bookmarks.create({
                url: undefined,
                title: "foo",
            });

            const urls = await menu.aggregate({
                menuItemId: "send",
                modifiers: [],
                editable: false,
                bookmarkId: id,
            });
            assert.deepEqual(urls, ["foo"]);
        });

        it("should ignore URLs (with audio)", async function () {
            await browser.storage.local.set({ "menu-contexts": ["video"] });

            const urls = await menu.aggregate({
                menuItemId: "send",
                modifiers: [],
                editable: false,
                mediaType: "audio",
                selectionText: "foo",
                linkUrl: "bar",
                srcUrl: "baz",
                frameUrl: "qux",
                pageUrl: "quux",
            });
            assert.deepEqual(urls, []);
        });

        it("should ignore URLs (with video)", async function () {
            await browser.storage.local.set({ "menu-contexts": ["audio"] });

            const urls = await menu.aggregate({
                menuItemId: "send",
                modifiers: [],
                editable: false,
                mediaType: "video",
                selectionText: "foo",
                linkUrl: "bar",
                srcUrl: "baz",
                frameUrl: "qux",
                pageUrl: "quux",
            });
            assert.deepEqual(urls, []);
        });

        it("should return URLs (with audio)", async function () {
            await browser.storage.local.set({
                "menu-contexts": [
                    "selection",
                    "link",
                    "audio",
                    "frame",
                    "page",
                ],
            });

            const urls = await menu.aggregate({
                menuItemId: "send",
                modifiers: [],
                editable: false,
                mediaType: "audio",
                selectionText: "foo",
                linkUrl: "bar",
                srcUrl: "baz",
                frameUrl: "qux",
                pageUrl: "quux",
            });
            assert.deepEqual(urls, ["foo", "bar", "baz", "qux", "quux"]);
        });

        it("should return URLs (with video)", async function () {
            await browser.storage.local.set({
                "menu-contexts": [
                    "selection",
                    "link",
                    "video",
                    "frame",
                    "page",
                ],
            });

            const urls = await menu.aggregate({
                menuItemId: "send",
                modifiers: [],
                editable: false,
                mediaType: "video",
                selectionText: "foo",
                linkUrl: "bar",
                srcUrl: "baz",
                frameUrl: "qux",
                pageUrl: "quux",
            });
            assert.deepEqual(urls, ["foo", "bar", "baz", "qux", "quux"]);
        });
    });

    describe("click()", function () {
        it("should notify not granted", async function () {
            // Comme il n'est pas possible de remplacer un export avec sinon,
            // remplacer la fonction appelée par l'export.
            const stub = sinon
                .stub(browser.notifications, "create")
                .resolves("foo");

            await menu.click({
                menuItemId: "add",
                modifiers: [],
                editable: false,
                linkUrl: "http://bar.com/",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                {
                    type: "basic",
                    iconUrl: "/img/icon128.png",
                    title: "Authorization not granted",
                    message: "The extension cannot access websites.",
                },
            ]);
        });

        it("should cast link", async function () {
            await browser.permissions.request({ origins: ["<all_urls>"] });
            await browser.storage.local.set({ "menu-contexts": ["link"] });
            browser.extension.inIncognitoContext = true;
            // Comme il n'est pas possible de remplacer un export avec sinon,
            // remplacer la fonction appelée par l'export.
            const stubGetAddons = sinon
                .stub(kodi.addons, "getAddons")
                .resolves([]);
            const stubAdd = sinon.stub(kodi.playlist, "add").resolves("OK");

            await menu.click({
                menuItemId: "add",
                modifiers: [],
                editable: false,
                linkUrl: "http://foo.com/",
            });

            assert.equal(stubGetAddons.callCount, 1);
            assert.deepEqual(stubGetAddons.firstCall.args, ["video"]);
            assert.equal(stubAdd.callCount, 1);
            assert.deepEqual(stubAdd.firstCall.args, ["http://foo.com/"]);
        });

        it("should notify bad link", async function () {
            await browser.permissions.request({ origins: ["<all_urls>"] });
            await browser.storage.local.set({ "menu-contexts": ["link"] });
            // Comme il n'est pas possible de remplacer un export avec sinon,
            // remplacer la fonction appelée par l'export.
            const stub = sinon
                .stub(browser.notifications, "create")
                .resolves("foo");

            await menu.click({
                menuItemId: "add",
                modifiers: [],
                editable: false,
                linkUrl: "???",
            });

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                {
                    type: "basic",
                    iconUrl: "/img/icon128.png",
                    title: "Unsupported link",
                    message: "Link ??? is invalid.",
                },
            ]);
        });
    });

    describe("change()", function () {
        it("should change server", async function () {
            await browser.storage.local.set({ "server-active": 0 });

            await menu.change(1);
            const config = await browser.storage.local.get();
            assert.deepEqual(config, { "server-active": 1 });
        });
    });
});
