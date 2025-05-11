/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeler from "../../../../../src/core/labeler/plugin/vtmgo.js";

describe("core/labeler/plugin/vtmgo.js", function () {
    describe("extractEpisode()", function () {
        it("should return label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.vtm.go/play/catalog/episodes/bar",
            );

            const label = await labeler.extractEpisode(url, {
                metaExtract: fake,
            });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });
    });

    describe("extractMovie()", function () {
        it("should return label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
            );

            const label = await labeler.extractMovie(url, {
                metaExtract: fake,
            });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://www.vtmgo.be/vtmgo/afspelen/bar"),
            ]);
        });
    });
});
