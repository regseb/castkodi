import assert from "node:assert";
import sinon from "sinon";
import { cast, mux } from "../../../src/core/index.js";
import { kodi } from "../../../src/core/kodi.js";

describe("core/index.js", function () {
    describe("mux()", function () {
        it("should ignore invalid input", function () {
            const urls = [
                undefined,
                "",
                " ",
                "www.foo.",
                "moz-extension://bar/index.html",
            ];

            const url = mux(urls);
            assert.strictEqual(url, undefined);
        });

        it("should return URL", function () {
            const urls = ["https://www.foo.bar/"];

            const url = mux(urls);
            assert.strictEqual(url, "https://www.foo.bar/");
        });

        it("should return URL with protocol HTTP", function () {
            const urls = ["www.foo.fr/"];

            const url = mux(urls);
            assert.strictEqual(url, "http://www.foo.fr/");
        });

        it("should return magnet URL", function () {
            const urls = [
                "magnet:?xt=urn:sha1:0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33",
            ];

            const url = mux(urls);
            assert.strictEqual(url,
                "magnet:?xt=urn:sha1:0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33");
        });

        it("should get acestream URL", function () {
            const urls = ["acestream://foo"];

            const url = mux(urls);
            assert.strictEqual(url, "acestream://foo");
        });

        it("should get plugin URL", function () {
            const urls = ["plugin://plugin.video.foo/bar?baz=qux"];

            const url = mux(urls);
            assert.strictEqual(url, "plugin://plugin.video.foo/bar?baz=qux");
        });
    });

    describe("cast()", function () {
        it("should reject invalid url", async function () {
            await assert.rejects(() => cast("send", ["foo"]), {
                name:    "PebkacError",
                type:    "noLink",
                message: "Link foo is invalid.",
            });
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);
        });

        it("should reject invalid urls", async function () {
            await assert.rejects(() => cast("send", ["foo", "bar"]), {
                name: "PebkacError",
                type: "noLinks",
            });
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);
        });

        it("should send url", async function () {
            browser.extension.inIncognitoContext = true;
            const stubClear = sinon.stub(kodi.playlist, "clear").resolves("OK");
            const stubAdd = sinon.stub(kodi.playlist, "add").resolves("OK");
            const stubOpen = sinon.stub(kodi.player, "open").resolves("OK");

            await cast("send", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);

            assert.strictEqual(stubClear.callCount, 1);
            assert.deepStrictEqual(stubClear.firstCall.args, []);
            assert.strictEqual(stubAdd.callCount, 1);
            assert.deepStrictEqual(stubAdd.firstCall.args, [
                "http://foo.com/bar",
            ]);
            assert.strictEqual(stubOpen.callCount, 1);
            assert.deepStrictEqual(stubOpen.firstCall.args, []);
        });

        it("should insert url", async function () {
            browser.extension.inIncognitoContext = true;
            const stubGetProperty = sinon.stub(kodi.player, "getProperty")
                                         .resolves(42);
            const stubInsert = sinon.stub(kodi.playlist, "insert")
                                    .resolves("OK");

            await cast("insert", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);

            assert.strictEqual(stubGetProperty.callCount, 1);
            assert.deepStrictEqual(stubGetProperty.firstCall.args,
                                   ["position"]);
            assert.strictEqual(stubInsert.callCount, 1);
            assert.deepStrictEqual(stubInsert.firstCall.args, [
                "http://foo.com/bar",
                43,
            ]);
        });

        it("should add url", async function () {
            browser.extension.inIncognitoContext = true;
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });

        it("should reject invalid action", async function () {
            await assert.rejects(() => cast("foo", ["http://foo.com/bar"]), {
                name:    "Error",
                message: "foo is not supported",
            });
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);
        });

        it("shouldn't add in history in incognito", async function () {
            browser.extension.inIncognitoContext = true;
            browser.storage.local.set({ "general-history": true });
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });

        it("should add in history", async function () {
            browser.storage.local.set({ "general-history": true });
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.deepStrictEqual(histories, [{ url: "http://foo.com/bar" }]);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/bar"]);
        });
    });
});
