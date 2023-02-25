import assert from "node:assert/strict";
import sinon from "sinon";
import { cast, mux } from "../../../src/core/index.js";
import { kodi } from "../../../src/core/jsonrpc/kodi.js";

describe("core/index.js", function () {
    describe("mux()", function () {
        it("should ignore invalid input", function () {
            const urls = [
                "",
                " ",
                // Tester une URL invalide, mais avec un préfixe valide.
                "http://:/",
                // Tester des URLs valides, mais avec des préfixes invalide.
                "prefix-http://bar.com/",
                "prefix-magnet://baz",
                "prefix-acestream://qux",
                "prefix-plugin://plugin.video.quux/",
                "moz-extension://corge/index.html",
            ];

            const url = mux(urls);
            assert.equal(url, undefined);
        });

        it("should return URL", function () {
            const urls = ["https://www.foo.bar/"];

            const url = mux(urls);
            assert.equal(url, "https://www.foo.bar/");
        });

        it("should add protocol HTTP", function () {
            const urls = ["www.foo.fr"];

            const url = mux(urls);
            assert.equal(url, "http://www.foo.fr");
        });

        it("should trim space", function () {
            const urls = ["\thttp://www.foo.fr \n"];

            const url = mux(urls);
            assert.equal(url, "http://www.foo.fr");
        });

        it("should return URL with port", function () {
            // Ajouter un tiret bas pour ne pas interpréter les deux-points
            // comme le séparateur entre le schéma et le nom de domaine.
            const urls = ["_foo:80"];

            const url = mux(urls);
            assert.equal(url, "http://_foo:80");
        });

        it("should return magnet URL", function () {
            const urls = [
                "magnet:?xt=urn:sha1:0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33",
            ];

            const url = mux(urls);
            assert.equal(url,
                "magnet:?xt=urn:sha1:0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33");
        });

        it("should get acestream URL", function () {
            const urls = ["acestream://foo"];

            const url = mux(urls);
            assert.equal(url, "acestream://foo");
        });

        it("should get plugin URL", function () {
            const urls = ["plugin://plugin.video.foo/bar?baz=qux"];

            const url = mux(urls);
            assert.equal(url, "plugin://plugin.video.foo/bar?baz=qux");
        });
    });

    describe("cast()", function () {
        it("should reject invalid url", async function () {
            await assert.rejects(() => cast("send", ["foo://bar"]), {
                name:    "PebkacError",
                message: "Link foo://bar is invalid.",
                type:    "noLink",
            });
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);
        });

        it("should reject invalid urls", async function () {
            await assert.rejects(() => cast("send", ["foo://bar", "baz:"]), {
                name: "PebkacError",
                type: "noLinks",
            });
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);
        });

        it("should send url", async function () {
            browser.extension.inIncognitoContext = true;
            const stubClear = sinon.stub(kodi.playlist, "clear").resolves("OK");
            const stubAdd = sinon.stub(kodi.playlist, "add").resolves("OK");
            const stubOpen = sinon.stub(kodi.player, "open").resolves("OK");

            await cast("send", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(stubClear.callCount, 1);
            assert.deepEqual(stubClear.firstCall.args, []);
            assert.equal(stubAdd.callCount, 1);
            assert.deepEqual(stubAdd.firstCall.args, ["http://foo.com/bar"]);
            assert.equal(stubOpen.callCount, 1);
            assert.deepEqual(stubOpen.firstCall.args, []);
        });

        it("should insert url", async function () {
            browser.extension.inIncognitoContext = true;
            const stubGetProperty = sinon.stub(kodi.player, "getProperty")
                                         .resolves(42);
            const stubInsert = sinon.stub(kodi.playlist, "insert")
                                    .resolves("OK");

            await cast("insert", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(stubGetProperty.callCount, 1);
            assert.deepEqual(stubGetProperty.firstCall.args,
                                   ["position"]);
            assert.equal(stubInsert.callCount, 1);
            assert.deepEqual(stubInsert.firstCall.args, [
                "http://foo.com/bar",
                43,
            ]);
        });

        it("should add url", async function () {
            browser.extension.inIncognitoContext = true;
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });

        it("should reject invalid action", async function () {
            await assert.rejects(() => cast("foo", ["http://foo.com/bar"]), {
                name:    "Error",
                message: "foo is not supported",
            });
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);
        });

        it("should add in history", async function () {
            browser.storage.local.set({ "general-history": true });
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.deepEqual(histories, [{ url: "http://foo.com/bar" }]);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });

        it("shouldn't add in history", async function () {
            browser.storage.local.set({ "general-history": false });
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });

        it("shouldn't add in history in incognito", async function () {
            browser.extension.inIncognitoContext = true;
            browser.storage.local.set({ "general-history": true });
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });

        it("should pass incognito on scrapers", async function () {
            browser.extension.inIncognitoContext = true;
            browser.storage.local.set({ "general-history": false });
            const stubAddons = sinon.stub(kodi.addons, "getAddons")
                                    .resolves([]);
            const stubPlaylist = sinon.stub(kodi.playlist, "add")
                                      .resolves("OK");

            await cast("add", ["http://youtu.be/foo"]);
            const histories = browser.history.search({ text: "" });
            assert.equal(histories.length, 0);

            assert.equal(stubAddons.callCount, 1);
            assert.deepEqual(stubAddons.firstCall.args, ["video"]);
            assert.equal(stubPlaylist.callCount, 1);
            assert.deepEqual(stubPlaylist.firstCall.args, [
                "plugin://plugin.video.youtube/play/?video_id=foo" +
                                                   "&incognito=true",
            ]);
        });
    });
});
