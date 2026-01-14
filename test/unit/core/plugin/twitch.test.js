/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/twitch.js";
import "../../setup.js";

describe("core/plugin/twitch.js", () => {
    describe("generateLiveUrl()", () => {
        it("should return URL with channel name", () => {
            const label = plugin.generateLiveUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.twitch/?mode=play&channel_name=foo",
            );
        });
    });

    describe("generateVideoUrl()", () => {
        it("should return URL with video id", () => {
            const label = plugin.generateVideoUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.twitch/?mode=play&video_id=foo",
            );
        });
    });

    describe("generateClipUrl()", () => {
        it("should return URL with clip id", () => {
            const label = plugin.generateClipUrl("foo");
            assert.equal(
                label,
                "plugin://plugin.video.twitch/?mode=play&slug=foo",
            );
        });
    });
});
