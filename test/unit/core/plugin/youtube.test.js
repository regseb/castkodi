/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import * as plugin from "../../../../src/core/plugin/youtube.js";
import { restoreAll } from "../../../polyfill/browser.js";
import "../../setup.js";

describe("core/plugin/youtube.js", () => {
    afterEach(() => {
        restoreAll();
    });

    describe("generateVideoUrl()", () => {
        it("should return YouTube URL", () => {
            const label = plugin.generateVideoUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=false",
            );
        });

        it("should return YouTube URL with incognito", () => {
            const label = plugin.generateVideoUrl("foo", true);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?video_id=foo&incognito=true",
            );
        });
    });

    describe("generatePlaylistUrl()", () => {
        it("should return YouTube URL", async () => {
            await browser.storage.local.set({ "youtube-order": "" });

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=false",
            );
        });

        it("should return YouTube URL with incognito", async () => {
            await browser.storage.local.set({ "youtube-order": "" });

            const label = await plugin.generatePlaylistUrl("foo", true);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=&play=1&incognito=true",
            );
        });

        it("should return YouTube URL with default order", async () => {
            await browser.storage.local.set({ "youtube-order": "default" });

            const label = await plugin.generatePlaylistUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/play/" +
                    "?playlist_id=foo&order=default&play=1&incognito=false",
            );
        });
    });

    describe("generateClipUrl()", () => {
        it("should return YouTube URL", () => {
            const label = plugin.generateClipUrl("foo", false);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/uri2addon/" +
                    "?uri=https%3A%2F%2Fwww.youtube.com%2Fclip%2Ffoo" +
                    "&incognito=false",
            );
        });

        it("should return YouTube URL with incognito", () => {
            const label = plugin.generateClipUrl("foo", true);
            assert.equal(
                label,
                "plugin://plugin.video.youtube/uri2addon/" +
                    "?uri=https%3A%2F%2Fwww.youtube.com%2Fclip%2Ffoo" +
                    "&incognito=true",
            );
        });
    });
});
