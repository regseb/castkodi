/**
 * @module
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
                new URL("https://vtm.be/vtmgo/afspelen/ebar"),
            ]);
        });

        it("should return label in Chromium", async function () {
            const fake = sinon.fake.resolves("foo");

            // Simuler un mauvais découpage d'une URL par Chromium.
            // https://issues.chromium.org/40063064
            const url = /** @type {URL} */ ({
                href: "plugin://plugin.video.vtm.go/play/catalog/episodes/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/episodes/bar",
            });

            const label = await labeler.extractEpisode(url, {
                metaExtract: fake,
            });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://vtm.be/vtmgo/afspelen/ebar"),
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
                new URL("https://vtm.be/vtmgo/afspelen/mbar"),
            ]);
        });

        it("should return label in Chromium", async function () {
            const fake = sinon.fake.resolves("foo");

            // Simuler un mauvais découpage d'une URL par Chromium.
            // https://issues.chromium.org/40063064
            const url = /** @type {URL} */ ({
                href: "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/movies/bar",
            });

            const label = await labeler.extractMovie(url, {
                metaExtract: fake,
            });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://vtm.be/vtmgo/afspelen/mbar"),
            ]);
        });
    });
});
