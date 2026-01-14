/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/tubed.js";
import "../../setup.js";

describe("core/plugin/tubed.js", () => {
    describe("generateVideoUrl()", () => {
        it("should return Tubed URL", () => {
            const label = plugin.generateVideoUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo",
            );
        });
    });

    describe("generatePlaylistUrl()", () => {
        it("should return Tubed URL", () => {
            const label = plugin.generatePlaylistUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.tubed/?mode=play&playlist_id=foo",
            );
        });
    });
});
