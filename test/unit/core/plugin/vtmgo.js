/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/vtmgo.js";

describe("core/plugin/vtmgo.js", function () {
    describe("generateEpisodeUrl()", function () {
        it("should return URL with episode id", function () {
            const label = plugin.generateEpisodeUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo",
            );
        });
    });

    describe("generateMovieUrl()", function () {
        it("should return URL with movie id", function () {
            const label = plugin.generateMovieUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo",
            );
        });
    });

    describe("generateChannelUrl()", function () {
        it("should return URL with channel id", function () {
            const label = plugin.generateChannelUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.vtm.go/play/catalog/channels/foo",
            );
        });
    });
});
