/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../src/core/labeler/youtube.js";

describe("core/labeler/youtube.js", function () {
    describe("extractVideo()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://studio.youtube.com/");

            const file = await labeler.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.youtube.com/watch?v=bar");

            const label = await labeler.extractVideo(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/watch?v=bar"),
            ]);
        });

        it("should return unavailable label", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("<html><head></head></html>"));

            const url = new URL("https://www.youtube.com/watch?v=foo");

            const label = await labeler.extractVideo(url);
            assert.equal(label, "(Video unavailable)");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/watch?v=foo"),
            ]);
        });

        it("should return undefined when there isn't 'v' parameter", async function () {
            const url = new URL("https://www.youtube.com/watch?foo=bar");

            const label = await labeler.extractVideo(url);
            assert.equal(label, undefined);
        });
    });

    describe("extractPlaylist()", function () {
        it("should return label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.youtube.com/playlist?list=bar");

            const label = await labeler.extractPlaylist(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/playlist?list=bar"),
            ]);
        });

        it("should return mix label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="undefined" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.youtube.com/playlist?list=foo");

            const label = await labeler.extractPlaylist(url);
            assert.equal(label, "Mix");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/playlist?list=foo"),
            ]);
        });

        it("should return undefined when there isn't 'list' parameter", async function () {
            const url = new URL("https://www.youtube.com/playlist?foo=bar");

            const label = await labeler.extractPlaylist(url);
            assert.equal(label, undefined);
        });
    });

    describe("actionClip()", function () {
        it("should return label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL("https://www.youtube.com/clip/bar");

            const label = await labeler.extractClip(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                new URL("https://www.youtube.com/clip/bar"),
            ]);
        });
    });
});
