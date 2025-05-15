/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/youtube.js";

describe("core/labeler/plugin/youtube.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("should return video label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.youtube/play/?video_id=bar",
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
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=bar&order=&play=1&incognito=false",
            );

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/playlist?list=bar"),
            ]);
        });

        it("should return undefined when there isn't parameter from YouTube", async function () {
            const metaExtract = mock.fn();

            const url = new URL("plugin://plugin.video.youtube/play/?bar=baz");

            const label = await labeler.extract(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });

    describe("extractUri()", function () {
        it("should return label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.youtube/uri2addon/" +
                    "?uri=https%3A%2F%2Fwww.youtube.com%2Fclip%2Fbar",
            );

            const label = await labeler.extractUri(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.youtube.com/clip/bar"),
            ]);
        });

        it("should return undefined when there isn't 'uri' parameter", async function () {
            const metaExtract = mock.fn();

            const url = new URL(
                "plugin://plugin.video.youtube/uri2addon/?bar=baz",
            );

            const label = await labeler.extractUri(url, { metaExtract });
            assert.equal(label, undefined);

            assert.equal(metaExtract.mock.callCount(), 0);
        });
    });
});
