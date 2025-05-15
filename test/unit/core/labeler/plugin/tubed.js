/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/tubed.js";

describe("core/labeler/plugin/tubed.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("should return video label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.tubed/?mode=play&video_id=bar",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/watch?v=bar"),
            ]);
        });

        it("should return playlist label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.tubed/?mode=play&playlist_id=bar",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/playlist?list=bar"),
            ]);
        });

        it("should return undefined when there isn't parameter from Tubed", async function () {
            const metaExtract = mock.fn();

            const url = new URL(
                "plugin://plugin.video.tubed/?mode=play&bar=baz",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });
});
