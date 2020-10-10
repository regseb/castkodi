import assert              from "assert";
import sinon               from "sinon";
import { cast, kodi, mux } from "../../../src/core/index.js";

describe("core/index.js", function () {
    describe("mux()", function () {
        it("should ignore invalid input", function () {
            const urls = [
                undefined,
                "",
                " ",
                "www.foo.",
                "moz-extension://0123456789abdcef/index.html",
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
            const urls = ["www.baz.fr/"];

            const url = mux(urls);
            assert.strictEqual(url, "http://www.baz.fr/");
        });

        it("should return magnet URL", function () {
            const urls = [
                "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                        "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4",
            ];

            const url = mux(urls);
            assert.strictEqual(url,
                "magnet:?xt=urn:btih:88594AAACBDE40EF3E2510C47374EC0AA396C08E" +
                                    "&dn=bbb_sunflower_1080p_30fps_normal.mp4" +
                  "&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce" +
                        "&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce" +
                       "&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net" +
                       "%2fvideo%2fmp4%2fbbb_sunflower_1080p_30fps_normal.mp4");
        });

        it("should get acestream URL", function () {
            const urls = ["acestream://0123456789abcdef"];

            const url = mux(urls);
            assert.strictEqual(url, "acestream://0123456789abcdef");
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

            stubClear.restore();
            stubAdd.restore();
            stubOpen.restore();
            browser.extension.inIncognitoContext = false;
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

            stubGetProperty.restore();
            stubInsert.restore();
            browser.extension.inIncognitoContext = false;
        });

        it("should add url", async function () {
            browser.extension.inIncognitoContext = true;
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.strictEqual(histories.length, 0);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, ["http://foo.com/bar"]);

            stub.restore();
            browser.extension.inIncognitoContext = false;
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

            stub.restore();
            browser.storage.local.clear();
            browser.extension.inIncognitoContext = false;
        });

        it("should add in history", async function () {
            browser.storage.local.set({ "general-history": true });
            const stub = sinon.stub(kodi.playlist, "add").resolves("OK");

            await cast("add", ["http://foo.com/bar"]);
            const histories = browser.history.search({ text: "" });
            assert.deepStrictEqual(histories, [{ url: "http://foo.com/bar" }]);

            stub.restore();
            browser.storage.local.clear();
            browser.history.deleteAll();
        });
    });

    describe("handleChange()", function () {
        it("should close connexion with kodi", function () {
            browser.storage.local.set({ "server-active": 0 });
            const stub = sinon.stub(kodi, "close");

            // Modifier la configuration pour que l'auditeur handleChange() soit
            // appelé.
            browser.storage.local.set({ "server-active": 1 });

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, []);

            browser.storage.local.clear();
            stub.restore();
        });
    });
});
