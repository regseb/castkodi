/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/vimeo.js";

describe("core/labeler/plugin/vimeo.js", function () {
    describe("extract()", function () {
        it("should return undefined when there isn't 'video_id' parameter", async function () {
            const metaExtract = mock.fn();

            const url = new URL("plugin://plugin.video.vimeo/play/?bar=baz");

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });

        it("should return label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.vimeo/play/?video_id=bar",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://vimeo.com/bar"),
            ]);
        });

        it("should return label from unlisted", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.vimeo/play/?video_id=bar:baz",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://vimeo.com/bar/baz"),
            ]);
        });
    });
});
