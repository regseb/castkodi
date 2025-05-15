/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/twitch.js";

describe("core/labeler/plugin/twitch.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("should return live label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.twitch/?channel_name=bar",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.twitch.tv/bar"),
            ]);
        });

        it("should return video label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL("plugin://plugin.video.twitch/?video_id=bar");

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.twitch.tv/videos/bar"),
            ]);
        });

        it("should return clip label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL("plugin://plugin.video.twitch/?slug=bar");

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.twitch.tv/clip/bar"),
            ]);
        });

        it("should return undefined when there isn't parameter", async function () {
            const metaExtract = mock.fn();

            const url = new URL("plugin://plugin.video.twitch/");

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });
});
