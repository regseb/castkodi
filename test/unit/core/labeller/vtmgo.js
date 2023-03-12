/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../src/core/labeller/vtmgo.js";

describe("core/labeller/vtmgo.js", function () {
    describe("extractEpisode()", function () {
        it("should return episode label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <h1 class="player__title">foo</h1>
                     </body></html>`,
                ),
            );

            const episodeId = "bar";

            const label = await labeller.extractEpisode(episodeId);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/ebar",
            ]);
        });
    });

    describe("extractMovie()", function () {
        it("should return movie label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <h1 class="player__title">foo</h1>
                     </body></html>`,
                ),
            );

            const movieId = "bar";

            const label = await labeller.extractMovie(movieId);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);
        });

        it("should return undefined when there isn't title", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <h1>foo</h1>
                     </body></html>`,
                ),
            );

            const movieId = "bar";

            const label = await labeller.extractMovie(movieId);
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/afspelen/mbar",
            ]);
        });
    });

    describe("extractChannel()", function () {
        it("should return channel label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><body>
                       <a data-gtm="foo/bar/baz">qux</a>
                     </body></html>`,
                ),
            );

            const channelId = "bar";

            const label = await labeller.extractChannel(channelId);
            assert.equal(label, "baz");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);
        });

        it("should return undefined when there isn't link", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("<html><body></body></html>"));

            const channelId = "bar";

            const label = await labeller.extractChannel(channelId);
            assert.equal(label, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vtm.be/vtmgo/live-kijken/vtm",
            ]);
        });
    });
});
