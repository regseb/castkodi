/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/soundcloud.js";

describe("core/labeler/plugin/soundcloud.js", function () {
    describe("extract()", function () {
        it("should return audio label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.audio.soundcloud/play/" +
                    "?url=https%3A%2F%2Fbar.io%2F",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://bar.io/"),
            ]);
        });

        it("should return undefined when there isn't 'url' parameter", async function () {
            const metaExtract = mock.fn();

            const url = new URL(
                "plugin://plugin.audio.soundcloud/play/?bar=baz",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });
});
