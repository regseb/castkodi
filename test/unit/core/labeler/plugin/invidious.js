/**
 * @license MIT
 * @author David Magnus Henriques
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/invidious.js";

describe("core/labeler/plugin/invidious.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("should return video label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.invidious/?action=play&videoId=bar",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/watch?v=bar"),
            ]);
        });

        it("should return undefined when there isn't parameter from Invidious", async function () {
            const metaExtract = mock.fn();

            const url = new URL(
                "plugin://plugin.video.invidious/?action=play&bar=baz",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });
});
