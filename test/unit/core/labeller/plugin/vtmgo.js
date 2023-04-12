/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as labeller from "../../../../../src/core/labeller/plugin/vtmgo.js";

describe("core/labeller/plugin/vtmgo.js", function () {
    describe("extractEpisode()", function () {
        it("should return label", async function () {
            const fake = sinon.fake.resolves("foo");

            const url = new URL(
                "plugin://plugin.video.vtm.go/play/catalog/episodes/bar",
            );

            const label = await labeller.extractEpisode(url, {
                metaExtract: fake,
            });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://vtm.be/vtmgo/afspelen/ebar"),
            ]);
        });

        it("should return label in Firefox", async function () {
            const fake = sinon.fake.resolves("foo");

            // Simuler un mauvais découpage d'une URL par Firefox.
            // https://bugzil.la/1374505
            const url = {
                href: "plugin://plugin.video.vtm.go/play/catalog/episodes/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/episodes/bar",
            };

            const label = await labeller.extractEpisode(url, {
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

            const label = await labeller.extractMovie(url, {
                metaExtract: fake,
            });
            assert.equal(label, "foo");

            assert.equal(fake.callCount, 1);
            assert.deepEqual(fake.firstCall.args, [
                new URL("https://vtm.be/vtmgo/afspelen/mbar"),
            ]);
        });

        it("should return label in Firefox", async function () {
            const fake = sinon.fake.resolves("foo");

            // Simuler un mauvais découpage d'une URL par Firefox.
            // https://bugzil.la/1374505
            const url = {
                href: "plugin://plugin.video.vtm.go/play/catalog/movies/bar",
                pathname: "//plugin.video.vtm.go/play/catalog/movies/bar",
            };

            const label = await labeller.extractMovie(url, {
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
