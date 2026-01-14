/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/vtmgo.js";
import "../../setup.js";

describe("core/plugin/vtmgo.js", () => {
    describe("generateEpisodeUrl()", () => {
        it("should return URL with episode id", () => {
            const label = plugin.generateEpisodeUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.vtm.go/play/catalog/episodes/foo",
            );
        });
    });

    describe("generateMovieUrl()", () => {
        it("should return URL with movie id", () => {
            const label = plugin.generateMovieUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.vtm.go/play/catalog/movies/foo",
            );
        });
    });

    describe("generateChannelUrl()", () => {
        it("should return URL with channel id", () => {
            const label = plugin.generateChannelUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.vtm.go/play/catalog/channels/foo",
            );
        });
    });
});
