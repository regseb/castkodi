import assert from "node:assert/strict";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/vtmgo.js";

describe("core/plugin/vtmgo.js", function () {
    describe("generateEpisodeUrl()", function () {
        it("should return URL with episode id", async function () {
            const label = await plugin.generateEpisodeUrl("foo");
            assert.equal(label,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo");
        });
    });

    describe("generateMovieUrl()", function () {
        it("should return URL with movie id", async function () {
            const label = await plugin.generateMovieUrl("foo");
            assert.equal(label,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo");
        });
    });

    describe("generateChannelUrl()", function () {
        it("should return URL with channel id", async function () {
            const label = await plugin.generateChannelUrl("foo");
            assert.equal(label,
                "plugin://plugin.video.vtm.go/play/catalog/channels/foo");
        });
    });

    describe("extractEpisode()", function () {
        it("should return undefined when type is unknown", async function () {
            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                        "/foo");

            const label = await plugin.extractEpisode(url);
            assert.equal(label, undefined);
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
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/ebar",
            ]);
        });

        it("should return episode label in Firefox", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <h1 class="player__title">foo</h1>
                   </body>
                 </html>`,
            ));

            // Simuler un mauvais découpage d'une URL par Firefox.
            // https://bugzil.la/1374505
            const url = {
                href:     "plugin://plugin.video.vtm.go/play/catalog/episodes" +
                                                                         "/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/episodes/bar",
            };

            const label = await plugin.extractEpisode(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/ebar",
            ]);
        });
    });

    describe("extractMovie()", function () {
        it("should return undefined when type is unknown", async function () {
            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                        "/foo");

            const label = await plugin.extractMovie(url);
            assert.equal(label, undefined);
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
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);
        });

        it("should return movie label in Firefox", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <h1 class="player__title">foo</h1>
                   </body>
                 </html>`,
            ));

            // Simuler un mauvais découpage d'une URL par Firefox.
            // https://bugzil.la/1374505
            const url = {
                href:     "plugin://plugin.video.vtm.go/play/catalog/movies" +
                                                                         "/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/movies/bar",
            };

            const label = await plugin.extractMovie(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);
        });

        it("should return undefined when there isn't title", async function () {
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
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);
        });
    });

    describe("extractChannel()", function () {
        it("should return undefined when type is unknown", async function () {
            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                                        "/foo");

            const label = await plugin.extractChannel(url);
            assert.equal(label, undefined);
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
            assert.equal(label, "baz");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);
        });

        it("should return channel label in Firefox", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body>
                     <a data-gtm="foo/bar/baz">qux</a>
                   </body>
                 </html>`,
            ));

            // Simuler un mauvais découpage d'une URL par Firefox.
            // https://bugzil.la/1374505
            const url = {
                href:     "plugin://plugin.video.vtm.go/play/catalog/channels" +
                                                                         "/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/channels/bar",
            };

            const label = await plugin.extractChannel(url);
            assert.equal(label, "baz");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);
        });

        it("should return undefined when there isn't link", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(new Response(
                `<html>
                   <body></body>
                 </html>`,
            ));

            const url = new URL("plugin://plugin.video.vtm.go/play/catalog" +
                                                               "/channels/bar");

            const label = await plugin.extractChannel(url);
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);
        });
    });
});
