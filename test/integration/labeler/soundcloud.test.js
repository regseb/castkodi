/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { complete } from "../../../src/core/labelers.js";
import { extract } from "../../../src/core/scrapers.js";
import "../setup.js";

describe("Labeler: SoundCloud", () => {
    it("should return audio label", async () => {
        const url = new URL("https://soundcloud.com/esa/hear-the-lightning");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Hear the lightning",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return set label", async () => {
        const url = new URL("https://soundcloud.com/esa/sets/news-views");
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "News & Views",
            position: 0,
            title: "",
            type: "unknown",
        });
    });

    it("should return dynamic set label", async () => {
        const url = new URL(
            "https://soundcloud.com/trending-music-fr/sets/pop",
        );
        const context = { depth: false, incognito: false };

        const file = /** @type {string} */ (await extract(url, context));
        const item = await complete({
            file,
            label: "play",
            position: 0,
            title: "",
            type: "unknown",
        });
        assert.deepEqual(item, {
            file,
            label: "Pop",
            position: 0,
            title: "",
            type: "unknown",
        });
    });
});
