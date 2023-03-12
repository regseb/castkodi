/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as plugin from "../../../../src/core/plugin/vimeo.js";

describe("core/plugin/vimeo.js", function () {
    describe("generateUrl()", function () {
        it("should return URL with video id", async function () {
            const label = await plugin.generateUrl("foo", undefined);
            assert.equal(
                label,
                "plugin://plugin.video.vimeo/play/?video_id=foo",
            );
        });

        it("should return URL with video id and hash", async function () {
            const label = await plugin.generateUrl("foo", "bar");
            assert.equal(
                label,
                "plugin://plugin.video.vimeo/play/?video_id=foo:bar",
            );
        });
    });

    describe("extract()", function () {
        it("should return undefined when there isn't 'video_id' parameter", async function () {
            const url = new URL("plugin://plugin.video.vimeo/play/?foo=bar");

            const label = await plugin.extract(url);
            assert.equal(label, undefined);
        });

        it("should return video label", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL(
                "plugin://plugin.video.vimeo/play/?video_id=bar",
            );

            const label = await plugin.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, ["https://vimeo.com/bar"]);
        });

        it("should return video label from unlisted", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                new Response(
                    `<html><head>
                       <meta property="og:title" content="foo" />
                     </head></html>`,
                ),
            );

            const url = new URL(
                "plugin://plugin.video.vimeo/play/?video_id=bar:baz",
            );

            const label = await plugin.extract(url);
            assert.equal(label, "foo");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://vimeo.com/bar/baz",
            ]);
        });
    });
});
