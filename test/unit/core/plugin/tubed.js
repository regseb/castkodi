/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/tubed.js";

describe("core/plugin/youtube.js", function () {
    describe("generateVideoUrl()", function () {
        it("should return Tubed URL", function () {
            const label = plugin.generateVideoUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.tubed/?mode=play&video_id=foo",
            );
        });
    });

    describe("generatePlaylistUrl()", function () {
        it("should return Tubed URL", function () {
            const label = plugin.generatePlaylistUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.tubed/?mode=play&playlist_id=foo",
            );
        });
    });
});
