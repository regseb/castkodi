/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/dailymotion.js";
import "../../../setup.js";

describe("core/labeler/plugin/dailymotion.js", () => {
    describe("extract()", () => {
        it("should return label", async () => {
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

        it("should return undefined when there isn't 'url' parameter", async () => {
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
