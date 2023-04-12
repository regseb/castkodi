/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import * as plugin from "../../../../src/core/plugin/youtube.js";

describe("core/plugin/youtube.js", function () {
    describe("generateVideoUrl()", function () {
        it("should return YouTube URL", function () {
            const label = plugin.generateVideoUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );
        });

        it("should return YouTube URL with incognito", function () {
            const label = plugin.generateVideoUrl("foo", true);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );
        });
    });

    describe("generatePlaylistUrl()", function () {
        it("should return YouTube URL", async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );
        });

        it("should return YouTube URL with incognito", async function () {
            browser.storage.local.set({ "youtube-order": "" });

            const label = await plugin.generatePlaylistUrl("foo", true);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=true",
            );
        });

        it("should return YouTube URL with default order", async function () {
            browser.storage.local.set({ "youtube-order": "default" });

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=default&play=1&incognito=false",
            );
        });
    });
});
