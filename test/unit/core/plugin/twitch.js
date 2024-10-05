/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/twitch.js";

describe("core/plugin/twitch.js", function () {
    describe("generateLiveUrl()", function () {
        it("should return URL with channel name", function () {
            const label = plugin.generateLiveUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });
    });

    describe("generateVideoUrl()", function () {
        it("should return URL with video id", function () {
            const label = plugin.generateVideoUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );
        });
    });

    describe("generateClipUrl()", function () {
        it("should return URL with clip id", function () {
            const label = plugin.generateClipUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });
    });
});
