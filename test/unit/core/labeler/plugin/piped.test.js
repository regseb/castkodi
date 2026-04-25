/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/piped.js";
import "../../../setup.js";

describe("core/labeler/plugin/piped.js", () => {
    describe("extract()", () => {
        it("should return video label", async () => {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL("plugin://plugin.video.piped/watch/bar");

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/watch?v=bar"),
            ]);
        });
    });
});
