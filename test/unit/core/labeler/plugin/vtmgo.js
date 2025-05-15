/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as labeler from "../../../../../src/core/labeler/plugin/vtmgo.js";

describe("core/labeler/plugin/vtmgo.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractEpisode()", function () {
        it("should return label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.vtm.go/play/catalog/episodes/bar",
            );

            const label = await labeler.extractEpisode(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });
    });

    describe("extractMovie()", function () {
        it("should return label", async function () {
            const metaExtract = mock.fn(() => Promise.resolve("foo"));

            const url = new URL(
                "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
            );

            const label = await labeler.extractMovie(url, { metaExtract });
            assert.equal(label, "foo");

            assert.equal(metaExtract.mock.callCount(), 1);
            assert.deepEqual(metaExtract.mock.calls[0].arguments, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });
    });
});
