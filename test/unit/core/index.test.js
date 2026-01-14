/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { cast, mux } from "../../../src/core/index.js";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";
import { restoreAll } from "../../polyfill/browser.js";
import "../setup.js";

describe("core/index.js", () => {
    afterEach(() => {
        mock.reset();
        restoreAll();
    });

    describe("mux()", () => {
        it("should ignore invalid input", () => {
            const urls = [
                "",
                " ",
                // Tester une URL invalide, mais avec un préfixe valide.
                "https://:/",
                // Tester des URLs valides, mais avec des préfixes non-gérés.
                "prefix-https://bar.com/",
                "prefix-magnet://baz",
                "prefix-acestream://qux",
                "prefix-plugin://plugin.video.quux/",
                "moz-extension://corge/index.html",
            ];

            const url = mux(urls);
            assert.equal(url, undefined);
        });

        it("should return URL", () => {
            const urls = ["https://www.foo.bar/"];

            const url = mux(urls);
            assert.equal(url, "https://www.foo.bar/");
        });

        it("should add protocol HTTP", () => {
            const urls = ["www.foo.fr"];

            const url = mux(urls);
            assert.equal(url, "http://www.foo.fr");
        });

        it("should trim space", () => {
            const urls = ["\thttps://www.foo.fr \n"];

            const url = mux(urls);
            assert.equal(url, "https://www.foo.fr");
        });

        it("should return URL with port", () => {
            // Ajouter un tiret bas pour ne pas interpréter les deux-points
            // comme le séparateur entre le schéma et le nom de domaine.
            const urls = ["_foo:80"];

            const url = mux(urls);
            assert.equal(url, "http://_foo:80");
        });

        it("should return magnet URL", () => {
            const urls = [
                "magnet:?xt=urn:sha1:0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33",
            ];

            const url = mux(urls);
            assert.equal(
                url,
                "magnet:?xt=urn:sha1:0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33",
            );
        });

        it("should get acestream URL", () => {
            const urls = ["acestream://foo"];

            const url = mux(urls);
            assert.equal(url, "acestream://foo");
        });

        it("should get plugin URL", () => {
            const urls = ["plugin://plugin.video.foo/bar?baz=qux"];

            const url = mux(urls);
            assert.equal(url, "plugin://plugin.video.foo/bar?baz=qux");
        });
    });

    describe("cast()", () => {
        it("should reject invalid url", async () => {
            await assert.rejects(() => cast("send", ["foo://bar"]), {
                name: "PebkacError",
                message: "Link foo://bar is invalid.",
                type: "noLink",
            });
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);
        });

        it("should reject invalid urls", async () => {
            await assert.rejects(() => cast("send", ["foo://bar", "baz:"]), {
                name: "PebkacError",
                type: "noLinks",
            });
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);
        });

        it("should send url", async () => {
            browser.extension.inIncognitoContext = true;
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const clear = mock.method(kodi.playlist, "clear", () =>
                Promise.resolve("OK"),
            );
            const add = mock.method(kodi.playlist, "add", () =>
                Promise.resolve("OK"),
            );
            const open = mock.method(kodi.player, "open", () =>
                Promise.resolve("OK"),
            );

            await cast("send", ["https://foo.com/bar"]);
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(clear.mock.callCount(), 1);
            assert.deepEqual(clear.mock.calls[0].arguments, []);
            assert.equal(add.mock.callCount(), 1);
            assert.deepEqual(add.mock.calls[0].arguments, [
                "https://foo.com/bar",
            ]);
            assert.equal(open.mock.callCount(), 1);
            assert.deepEqual(open.mock.calls[0].arguments, []);
        });

        it("should insert url", async () => {
            browser.extension.inIncognitoContext = true;
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const getProperty = mock.method(kodi.player, "getProperty", () =>
                Promise.resolve(42),
            );
            const insert = mock.method(kodi.playlist, "insert", () =>
                Promise.resolve("OK"),
            );

            await cast("insert", ["https://foo.com/bar"]);
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(getProperty.mock.callCount(), 1);
            assert.deepEqual(getProperty.mock.calls[0].arguments, ["position"]);
            assert.equal(insert.mock.callCount(), 1);
            assert.deepEqual(insert.mock.calls[0].arguments, [
                "https://foo.com/bar",
                43,
            ]);
        });

        it("should add url", async () => {
            browser.extension.inIncognitoContext = true;
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const add = mock.method(kodi.playlist, "add", () =>
                Promise.resolve("OK"),
            );

            await cast("add", ["https://foo.com/bar"]);
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(add.mock.callCount(), 1);
            assert.deepEqual(add.mock.calls[0].arguments, [
                "https://foo.com/bar",
            ]);
        });

        it("should reject invalid action", async () => {
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );

            await assert.rejects(() => cast("foo", ["https://foo.com/bar"]), {
                name: "Error",
                message: "foo is not supported",
            });
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
        });

        it("should add in history", async () => {
            await browser.storage.local.set({ "general-history": true });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const add = mock.method(kodi.playlist, "add", () =>
                Promise.resolve("OK"),
            );

            await cast("add", ["https://foo.com/bar"]);
            const histories = await browser.history.search({ text: "" });
            assert.deepEqual(histories, [
                { id: "1", url: "https://foo.com/bar" },
            ]);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(add.mock.callCount(), 1);
            assert.deepEqual(add.mock.calls[0].arguments, [
                "https://foo.com/bar",
            ]);
        });

        it("shouldn't add in history", async () => {
            await browser.storage.local.set({ "general-history": false });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const add = mock.method(kodi.playlist, "add", () =>
                Promise.resolve("OK"),
            );

            await cast("add", ["https://foo.com/bar"]);
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(add.mock.callCount(), 1);
            assert.deepEqual(add.mock.calls[0].arguments, [
                "https://foo.com/bar",
            ]);
        });

        it("shouldn't add in history in incognito", async () => {
            browser.extension.inIncognitoContext = true;
            await browser.storage.local.set({ "general-history": true });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const add = mock.method(kodi.playlist, "add", () =>
                Promise.resolve("OK"),
            );

            await cast("add", ["https://foo.com/bar"]);
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(add.mock.callCount(), 1);
            assert.deepEqual(add.mock.calls[0].arguments, [
                "https://foo.com/bar",
            ]);
        });

        it("should pass incognito on scrapers", async () => {
            browser.extension.inIncognitoContext = true;
            await browser.storage.local.set({ "general-history": false });
            const getAddons = mock.method(kodi.addons, "getAddons", () =>
                Promise.resolve([]),
            );
            const add = mock.method(kodi.playlist, "add", () =>
                Promise.resolve("OK"),
            );

            await cast("add", ["https://youtu.be/foo"]);
            const histories = await browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(getAddons.mock.callCount(), 1);
            assert.deepEqual(getAddons.mock.calls[0].arguments, ["video"]);
            assert.equal(add.mock.callCount(), 1);
            assert.deepEqual(add.mock.calls[0].arguments, [
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            ]);
        });
    });
});
