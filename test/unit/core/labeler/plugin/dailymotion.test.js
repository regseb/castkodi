/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/dailymotion.js";

describe("core/labeler/plugin/dailymotion.js", function () {
    describe("extract()", function () {
        it("should return label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.dailymotion_com/?url=bar",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.dailymotion.com/video/bar"),
            ]);
        });

        it("should return undefined when there isn't 'url' parameter", async function () {
            const metaExtract = mock.fn();

            const url = new URL(
                "plugin://plugin.video.dailymotion_com/?bar=baz",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });
});
