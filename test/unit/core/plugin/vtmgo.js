import assert from "node:assert";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/vtmgo.js";

describe("core/plugin/vtmgo.js", function () {
    describe("generateEpisodeUrl()", function () {
        it("should return URL with episode id", async function () {
            const label = await plugin.generateEpisodeUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo");
        });
    });

    describe("generateMovieUrl()", function () {
        it("should return URL with movie id", async function () {
            const label = await plugin.generateMovieUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo");
        });
    });

    describe("generateChannelUrl()", function () {
        it("should return URL with channel id", async function () {
            const label = await plugin.generateChannelUrl("foo");
            assert.strictEqual(label,
                "plugin://plugin.video.vtm.go/play/catalog/channels/foo");
        });
    });

    describe("extractEpisode()", function () {
        it("should return null when type is unknown", async function () {
            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                        "/foo");

            const label = await plugin.extractEpisode(url);
            assert.strictEqual(label, null);
        });

        it("should return episode label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <h1 class="player__title">foo</h1>
                   </body>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                               "/episodes/bar");

            const label = await plugin.extractEpisode(url);
            assert.strictEqual(label, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/ebar",
            ]);

            stub.restore();
        });
    });

    describe("extractMovie()", function () {
        it("should return null when type is unknown", async function () {
            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                        "/foo");

            const label = await plugin.extractMovie(url);
            assert.strictEqual(label, null);
        });

        it("should return movie label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <h1 class="player__title">foo</h1>
                   </body>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                 "/movies/bar");

            const label = await plugin.extractMovie(url);
            assert.strictEqual(label, "foo");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);

            stub.restore();
        });

        it("should return null when there isn't title", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <h1>foo</h1>
                   </body>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                 "/movies/bar");

            const label = await plugin.extractMovie(url);
            assert.strictEqual(label, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);

            stub.restore();
        });
    });

    describe("extractChannel()", function () {
        it("should return null when type is unknown", async function () {
            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                        "/foo");

            const label = await plugin.extractChannel(url);
            assert.strictEqual(label, null);
        });

        it("should return channel label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <a data-gtm="foo/bar/baz">qux</a>
                   </body>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                               "/channels/bar");

            const label = await plugin.extractChannel(url);
            assert.strictEqual(label, "baz");

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);

            stub.restore();
        });

        it("should return null when there isn't link", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body></body>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                               "/channels/bar");

            const label = await plugin.extractChannel(url);
            assert.strictEqual(label, null);

            assert.strictEqual(stub.callCount, 1);
            assert.deepStrictEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);

            stub.restore();
        });
    });
});
